import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { clamp, gauss, makeRandom, smoothstep, useThemeColors } from '../lib/parts.js'
import SceneFog from './SceneFog.jsx'

/**
 * A field of small "parts" that fills the whole hero. Loose, they drift across the viewport and
 * get nudged away from the cursor. As `progressRef` goes 0 → 1 they sort themselves into a torus
 * knot framed to the right of the headline (above it on narrow screens).
 */

const CAMERA_Z = 7.6
const dummy = new THREE.Object3D()
const v = new THREE.Vector3()
const knotRot = new THREE.Matrix4()
const euler = new THREE.Euler()

// The knot's bounding radius at scale 1, including its tilt (TorusKnotGeometry reaches 1.5 × radius).
const KNOT_R = 2.6

/** Where the knot sits and how big it is for this viewport, in world units on the z = 0 plane. */
function frameKnot(viewport) {
  const W = viewport.width / 2
  const H = viewport.height / 2
  if (viewport.aspect < 1) {
    // Portrait: the copy sits at the bottom, so the knot takes the upper quarter, under the nav.
    const extent = Math.min(0.36 * H, 0.85 * W)
    return { x: 0, y: 0.5 * H, scale: extent / KNOT_R, W, H }
  }
  // Landscape: the copy takes the left seven columns, the knot the right, clear of the nav band.
  const extent = Math.min(0.68 * H, 0.47 * W)
  return { x: 0.48 * W, y: -0.08 * H, scale: Math.min(1, extent / KNOT_R), W, H }
}

function Parts({ count, progressRef, pointerRef }) {
  const mesh = useRef(null)
  const { viewport, gl } = useThree()
  const colors = useThemeColors()
  const smooth = useRef(0)
  const tilt = useRef({ x: 0, y: 0 })

  // Let the page keep scrolling when a finger lands on the canvas.
  useEffect(() => {
    gl.domElement.style.touchAction = 'pan-y'
  }, [gl])

  const data = useMemo(() => {
    const rand = makeRandom(20250908)
    const geo = new THREE.TorusKnotGeometry(1.3, 0.42, 220, 28, 2, 3)
    const pos = geo.attributes.position
    const total = pos.count

    const target = new Float32Array(count * 3)
    const loose = new Float32Array(count * 3) // in standard deviations around the knot's spot
    const delay = new Float32Array(count)
    const size = new Float32Array(count)
    const spin = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const accent = new Uint8Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const vi = Math.floor(rand() * total)
      target[i3] = pos.getX(vi)
      target[i3 + 1] = pos.getY(vi)
      target[i3 + 2] = pos.getZ(vi)

      // Loose, the parts form a soft cloud around the spot where the knot will be, so the mess
      // already hints at where things end up and thins out toward the copy.
      loose[i3] = gauss(rand)
      loose[i3 + 1] = gauss(rand)
      loose[i3 + 2] = gauss(rand)

      delay[i] = rand() * 0.5
      size[i] = 0.06 + rand() * 0.06
      spin[i3] = rand() * Math.PI
      spin[i3 + 1] = rand() * Math.PI
      spin[i3 + 2] = rand() * Math.PI
      seed[i] = rand() * 100
      accent[i] = rand() < 0.08 ? 1 : 0
    }
    geo.dispose()
    return { target, loose, delay, size, spin, seed, accent }
  }, [count])

  // Colours go on before the first frame renders, so the parts never flash white.
  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    const base = new THREE.Color(colors.base)
    const acc = new THREE.Color(colors.accent)
    for (let i = 0; i < count; i++) m.setColorAt(i, data.accent[i] ? acc : base)
    m.instanceColor.needsUpdate = true
  }, [colors, count, data])

  useFrame((state, dt) => {
    const m = mesh.current
    if (!m) return
    const t = state.clock.elapsedTime
    const step = Math.min(1, dt * 5)

    smooth.current += (progressRef.current - smooth.current) * step
    const p = smooth.current

    const pt = pointerRef.current
    const tstep = Math.min(1, dt * 2.5)
    tilt.current.x += (-clamp(pt.y, -1.6, 1.6) * 0.28 - tilt.current.x) * tstep
    tilt.current.y += (clamp(pt.x, -1.6, 1.6) * 0.42 - tilt.current.y) * tstep

    const knot = frameKnot(viewport)
    const rx = 0.32 + tilt.current.x
    const ry = t * 0.16 + tilt.current.y
    const rz = 0.12
    knotRot.makeRotationFromEuler(euler.set(rx, ry, rz))

    // One standard deviation of the loose cloud, in world units. It reaches the whole viewport
    // but stays densest around the knot.
    const portrait = viewport.aspect < 1
    const sx = knot.W * (portrait ? 0.5 : 0.4)
    const sy = knot.H * (portrait ? 0.22 : 0.44)
    const sz = 0.8

    // Cursor on the z = 0 plane, in world units.
    const cx = pt.x * knot.W
    const cy = pt.y * knot.H
    const R = 0.8

    const { target, loose, delay, size, spin, seed } = data
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const d = delay[i]
      const k = smoothstep(clamp((p - d) / (1 - d), 0, 1))
      const open = 1 - k

      const lx = knot.x + loose[i3] * sx + Math.sin(t * 0.5 + seed[i]) * 0.16 * open
      const ly = knot.y + loose[i3 + 1] * sy + Math.cos(t * 0.4 + seed[i] * 1.3) * 0.16 * open
      const lz = loose[i3 + 2] * sz + Math.sin(t * 0.45 + seed[i] * 0.7) * 0.16 * open

      let x = lx
      let y = ly
      let z = lz
      if (k > 0) {
        v.set(target[i3], target[i3 + 1], target[i3 + 2]).applyMatrix4(knotRot).multiplyScalar(knot.scale)
        x += (v.x + knot.x - lx) * k
        y += (v.y + knot.y - ly) * k
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
        }
      }

      dummy.position.set(x, y, z)
      dummy.rotation.set(
        spin[i3] + t * 0.3 * open + rx * k,
        spin[i3 + 1] + t * 0.2 * open + ry * k,
        spin[i3 + 2] + rz * k,
      )
      dummy.scale.setScalar(size[i] * (0.7 + 0.3 * k) * (0.85 + 0.15 * knot.scale))
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.55} metalness={0.08} flatShading />
    </instancedMesh>
  )
}

export default function HeroScene({ count, progressRef, active }) {
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
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} />
        <directionalLight position={[-5, -2, -4]} intensity={0.9} />
        <Parts count={count} progressRef={progressRef} pointerRef={pointerRef} />
      </Canvas>
    </div>
  )
}
