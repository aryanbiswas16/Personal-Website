import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { clamp, gauss, makeRandom, smoothstep, useThemeColors } from '../lib/parts.js'
import SceneFog from './SceneFog.jsx'

/**
 * A field of small "parts" that fills the whole hero. Loose, they drift across the viewport and
 * get nudged away from the cursor. As `progressRef` goes 0 → 1 they assemble into a cube mosaic of
 * my avatar (src/data/portrait.js), framed to the right of the headline (above it on narrow
 * screens), and take on its colours as they land.
 */

const CAMERA_Z = 7.6
const dummy = new THREE.Object3D()
const v = new THREE.Vector3()
const frameRot = new THREE.Matrix4()
const euler = new THREE.Euler()
const tmp = new THREE.Color()

// The portrait is built 5 units tall; this is its bounding radius at scale 1, with a little air.
const PORTRAIT_H = 5
const PORTRAIT_R = 2.7

/** Where the portrait sits and how big it is for this viewport, in world units on the z = 0 plane. */
function framePortrait(viewport) {
  const W = viewport.width / 2
  const H = viewport.height / 2
  if (viewport.aspect < 1) {
    // Portrait: the face sits in the band the stylesheet keeps clear above the copy, under the nav.
    // Sized in CSS pixels to match that band (Hero.module.css, max-width: 899px).
    const px = viewport.factor
    const radius = Math.min(0.4 * W * 2 * px, 165)
    return { x: 0, y: H - (72 + radius) / px, scale: radius / px / PORTRAIT_R, W, H }
  }
  // Landscape: the copy takes the left seven columns, the face the right, clear of the nav band.
  const extent = Math.min(0.72 * H, 0.48 * W)
  return { x: 0.48 * W, y: -0.06 * H, scale: Math.min(1.1, extent / PORTRAIT_R), W, H }
}

/** Dark theme lifts the near-black hair and jacket so they still read against the page. */
function portraitColor(r, g, b, lift) {
  const f = (c) => lift + (1 - lift) * (c / 255)
  return tmp.setRGB(f(r), f(g), f(b), THREE.SRGBColorSpace)
}

function luminance(hex) {
  const c = new THREE.Color(hex)
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
}

function Parts({ portrait, progressRef, pointerRef }) {
  const mesh = useRef(null)
  const { viewport, gl } = useThree()
  const colors = useThemeColors()
  const smooth = useRef(0)
  const tilt = useRef({ x: 0, y: 0 })
  const count = portrait.cells.length / 5

  // Let the page keep scrolling when a finger lands on the canvas.
  useEffect(() => {
    gl.domElement.style.touchAction = 'pan-y'
  }, [gl])

  const data = useMemo(() => {
    const rand = makeRandom(20250908)
    const { cols, rows, cells } = portrait
    const cell = PORTRAIT_H / rows

    const target = new Float32Array(count * 3)
    const loose = new Float32Array(count * 3) // in standard deviations around the portrait's spot
    const delay = new Float32Array(count)
    const size = new Float32Array(count)
    const spin = new Float32Array(count * 3)
    const seed = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const c = cells[i * 5]
      const r = cells[i * 5 + 1]

      // A shallow dome centred on the face, so the mosaic has some depth when it tilts.
      const u = c / cols - 0.5
      const w = r / rows - 0.38
      target[i3] = (c - cols / 2 + 0.5) * cell
      target[i3 + 1] = (rows / 2 - r - 0.5) * cell
      target[i3 + 2] = 0.55 * Math.exp(-(u * u + w * w) / 0.07) + (rand() - 0.5) * 0.04

      loose[i3] = gauss(rand)
      loose[i3 + 1] = gauss(rand)
      loose[i3 + 2] = gauss(rand)

      // Builds from the shoulders up, so the face is the last thing to land.
      delay[i] = 0.42 * (1 - r / rows) + rand() * 0.16
      size[i] = 0.06 + rand() * 0.06
      spin[i3] = rand() * Math.PI
      spin[i3 + 1] = rand() * Math.PI
      spin[i3 + 2] = rand() * Math.PI
      seed[i] = rand() * 100
    }
    return { target, loose, delay, size, spin, seed, cell }
  }, [portrait, count])

  // Each part fades from its theme colour (loose) to its portrait colour (landed).
  const palette = useMemo(() => {
    const from = new Float32Array(count * 3)
    const to = new Float32Array(count * 3)
    const base = new THREE.Color(colors.base)
    const acc = new THREE.Color(colors.accent)
    const lift = luminance(colors.bg) < 0.2 ? 0.16 : 0
    const rand = makeRandom(1305)
    const { cells } = portrait
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      ;(rand() < 0.08 ? acc : base).toArray(from, i3)
      portraitColor(cells[i * 5 + 2], cells[i * 5 + 3], cells[i * 5 + 4], lift).toArray(to, i3)
    }
    return { from, to }
  }, [colors, portrait, count])

  // Colours go on before the first frame renders, so the parts never flash white.
  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    for (let i = 0; i < count; i++) m.setColorAt(i, tmp.fromArray(palette.from, i * 3))
    m.instanceColor.needsUpdate = true
  }, [palette, count])

  useFrame((state, dt) => {
    const m = mesh.current
    if (!m) return
    const t = state.clock.elapsedTime
    const step = Math.min(1, dt * 4)

    smooth.current += (progressRef.current - smooth.current) * step
    const p = smooth.current

    const pt = pointerRef.current
    const tstep = Math.min(1, dt * 2.5)
    tilt.current.x += (-clamp(pt.y, -1.6, 1.6) * 0.22 - tilt.current.x) * tstep
    tilt.current.y += (clamp(pt.x - 0.45, -1.6, 1.6) * 0.38 - tilt.current.y) * tstep

    const frame = framePortrait(viewport)
    // The face looks around a little on its own, and toward the cursor when there is one.
    const rx = 0.04 + tilt.current.x + Math.sin(t * 0.31) * 0.04
    const ry = -0.12 + tilt.current.y + Math.sin(t * 0.23) * 0.1
    const rz = 0
    frameRot.makeRotationFromEuler(euler.set(rx, ry, rz))

    // One standard deviation of the loose cloud, in world units. It reaches the whole viewport
    // but stays densest around the portrait.
    const portraitView = viewport.aspect < 1
    const sx = frame.W * (portraitView ? 0.5 : 0.4)
    const sy = frame.H * (portraitView ? 0.22 : 0.44)
    const sz = 0.8

    // Cursor on the z = 0 plane, in world units.
    const cx = pt.x * frame.W
    const cy = pt.y * frame.H
    const R = 0.8

    const { target, loose, delay, size, spin, seed, cell } = data
    const tile = cell * 0.86
    const col = m.instanceColor.array
    const { from, to } = palette
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const d = delay[i]
      const k = smoothstep(clamp((p - d) / (1 - d), 0, 1))
      const open = 1 - k

      const lx = frame.x + loose[i3] * sx + Math.sin(t * 0.5 + seed[i]) * 0.16 * open
      const ly = frame.y + loose[i3 + 1] * sy + Math.cos(t * 0.4 + seed[i] * 1.3) * 0.16 * open
      const lz = loose[i3 + 2] * sz + Math.sin(t * 0.45 + seed[i] * 0.7) * 0.16 * open

      let x = lx
      let y = ly
      let z = lz
      if (k > 0) {
        v.set(target[i3], target[i3 + 1], target[i3 + 2]).applyMatrix4(frameRot).multiplyScalar(frame.scale)
        x += (v.x + frame.x - lx) * k
        y += (v.y + frame.y - ly) * k
        z += (v.z - lz) * k
      }

      if (pt.active) {
        // Compare where the part appears on screen, not where it sits in depth.
        const proj = CAMERA_Z / (CAMERA_Z - z)
        const dx = x * proj - cx
        const dy = y * proj - cy
        const dist = Math.hypot(dx, dy)
        if (dist < R && dist > 1e-4) {
          const f = 1 - dist / R
          const amt = (f * f * 0.55) / proj
          x += (dx / dist) * amt
          y += (dy / dist) * amt
          z += f * f * 0.4
        }
      }

      dummy.position.set(x, y, z)
      dummy.rotation.set(
        spin[i3] * open + t * 0.3 * open + rx * k,
        spin[i3 + 1] * open + t * 0.2 * open + ry * k,
        spin[i3 + 2] * open + rz * k,
      )
      dummy.scale.setScalar((size[i] * open + tile * k) * frame.scale)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)

      col[i3] = from[i3] + (to[i3] - from[i3]) * k
      col[i3 + 1] = from[i3 + 1] + (to[i3 + 1] - from[i3 + 1]) * k
      col[i3 + 2] = from[i3 + 2] + (to[i3 + 2] - from[i3 + 2]) * k
    }
    m.instanceMatrix.needsUpdate = true
    m.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.6} metalness={0.05} flatShading />
    </instancedMesh>
  )
}

export default function HeroScene({ portrait, progressRef, active }) {
  const wrapRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      pointerRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
      pointerRef.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
      pointerRef.current.active = true
    }
    const onLeave = () => {
      pointerRef.current.active = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('blur', onLeave)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', onLeave)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, CAMERA_Z], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
        style={{ background: 'transparent' }}
      >
        <SceneFog near={7.4} far={11.2} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 6]} intensity={1.9} />
        <directionalLight position={[-5, -2, -4]} intensity={0.6} />
        <Parts portrait={portrait} progressRef={progressRef} pointerRef={pointerRef} />
      </Canvas>
    </div>
  )
}
