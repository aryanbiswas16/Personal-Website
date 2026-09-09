import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { clamp, gauss, makeRandom, smoothstep, useThemeColors } from '../lib/parts.js'
import SceneFog from './SceneFog.jsx'

/**
 * The hero's parts, one last time. A loose cloud folds itself into a paper plane as
 * `progressRef` goes 0 → 1, then hovers, leaning toward the cursor.
 */

const CAMERA_Z = 7
const dummy = new THREE.Object3D()
const v = new THREE.Vector3()
const rot = new THREE.Matrix4()
const euler = new THREE.Euler()

// A classic dart with its nose along +x: about three units long, two and a half wide.
const NOSE = [1.6, 0, 0]
const TAIL_L = [-1.4, 0.55, 1.2]
const TAIL_R = [-1.4, 0.55, -1.2]
const FOLD_L = [-1.4, 0.14, 0.5]
const FOLD_R = [-1.4, 0.14, -0.5]
const SPINE = [-1.4, 0.02, 0]
const KEEL = [-1.4, -0.8, 0]

// The sheets of paper, as triangles.
const SHEETS = [
  [NOSE, TAIL_L, SPINE],
  [NOSE, SPINE, TAIL_R],
  [NOSE, FOLD_L, SPINE],
  [NOSE, SPINE, FOLD_R],
  [NOSE, SPINE, KEEL],
]

// The creases and edges that keep the silhouette crisp.
const EDGES = [
  [NOSE, TAIL_L],
  [TAIL_L, SPINE],
  [NOSE, TAIL_R],
  [TAIL_R, SPINE],
  [NOSE, FOLD_L],
  [NOSE, FOLD_R],
  [NOSE, KEEL],
  [KEEL, SPINE],
  [NOSE, SPINE],
]

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const length = (a) => Math.hypot(a[0], a[1], a[2])
const area = ([a, b, c]) => {
  const u = sub(b, a)
  const w = sub(c, a)
  return 0.5 * length([u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]])
}

/** Picks index i with probability weights[i] / total. */
function pick(weights, total, r) {
  let x = r * total
  for (let i = 0; i < weights.length - 1; i++) {
    if (x < weights[i]) return i
    x -= weights[i]
  }
  return weights.length - 1
}

/** Points over the plane: sheets and creases in roughly equal measure, so the outline stays crisp. */
function samplePlane(count, rand) {
  const out = new Float32Array(count * 3)
  const areas = SHEETS.map(area)
  const areaTotal = areas.reduce((s, a) => s + a, 0)
  const lengths = EDGES.map(([a, b]) => length(sub(b, a)))
  const lengthTotal = lengths.reduce((s, l) => s + l, 0)
  const onEdges = Math.floor(count * 0.4)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    let x
    let y
    let z
    if (i < onEdges) {
      const [a, b] = EDGES[pick(lengths, lengthTotal, rand())]
      const t = rand()
      x = a[0] + (b[0] - a[0]) * t
      y = a[1] + (b[1] - a[1]) * t
      z = a[2] + (b[2] - a[2]) * t
    } else {
      const [a, b, c] = SHEETS[pick(areas, areaTotal, rand())]
      let u = rand()
      let w = rand()
      if (u + w > 1) {
        u = 1 - u
        w = 1 - w
      }
      x = a[0] + (b[0] - a[0]) * u + (c[0] - a[0]) * w
      y = a[1] + (b[1] - a[1]) * u + (c[1] - a[1]) * w
      z = a[2] + (b[2] - a[2]) * u + (c[2] - a[2]) * w
    }
    // A hair of thickness, so a sheet reads as paper rather than a single line of cubes.
    out[i3] = x
    out[i3 + 1] = y + (rand() - 0.5) * 0.04
    out[i3 + 2] = z + (rand() - 0.5) * 0.02
  }
  return out
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
    const rand = makeRandom(20260908)
    const target = samplePlane(count, rand)
    const loose = new Float32Array(count * 3)
    const delay = new Float32Array(count)
    const size = new Float32Array(count)
    const spin = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const accent = new Uint8Array(count)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Loose, a soft cloud in the middle of the figure (in standard deviations).
      loose[i3] = gauss(rand)
      loose[i3 + 1] = gauss(rand)
      loose[i3 + 2] = gauss(rand)
      delay[i] = rand() * 0.5
      size[i] = 0.045 + rand() * 0.045
      spin[i3] = rand() * Math.PI
      spin[i3 + 1] = rand() * Math.PI
      spin[i3 + 2] = rand() * Math.PI
      seed[i] = rand() * 100
      accent[i] = rand() < 0.08 ? 1 : 0
    }
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

    // The folded plane leans toward the cursor while it is nearby.
    const pt = pointerRef.current
    const tstep = Math.min(1, dt * 3)
    const aimX = pt.active ? -clamp(pt.y, -1, 1) * 0.22 : 0
    const aimY = pt.active ? clamp(pt.x, -1, 1) * 0.3 : 0
    tilt.current.x += (aimX - tilt.current.x) * tstep
    tilt.current.y += (aimY - tilt.current.y) * tstep

    const W = viewport.width / 2
    const H = viewport.height / 2
    const scale = clamp(Math.min(W / 2.45, H / 1.8), 0.6, 1.3)

    // Folded, the plane is seen from behind, above, and a little to the left, nose climbing to the
    // upper right and away from the viewer: the view every send icon uses, with the wide tail
    // nearest and the keel hanging under it. The order matters: yaw (y) first, then the
    // look-from-above tilt (x), then a pure screen roll (z) that sets the climb without changing
    // which surfaces face the camera. It bobs as if held up by the air.
    const rx = 0.6 + Math.sin(t * 0.7) * 0.04 + tilt.current.x
    const ry = 0.62 + Math.sin(t * 0.45) * 0.08 + tilt.current.y
    const rz = 0.36 + Math.cos(t * 0.6) * 0.03
    rot.makeRotationFromEuler(euler.set(rx, ry, rz, 'ZXY'))
    // Seen this way the picture sits left of and below the origin; nudge it back to centre.
    const centreX = 0.45 * scale
    const centreY = 0.25 * scale
    const bob = Math.sin(t * 0.9) * 0.06 * p

    // Cursor on the z = 0 plane, in world units.
    const cx = pt.x * W
    const cy = pt.y * H
    const R = 0.7

    const { target, loose, delay, size, spin, seed } = data
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const k = smoothstep(clamp((p - delay[i]) / (1 - delay[i]), 0, 1))
      const open = 1 - k

      const lx = loose[i3] * W * 0.42 + Math.sin(t * 0.5 + seed[i]) * 0.14 * open
      const ly = loose[i3 + 1] * H * 0.4 + Math.cos(t * 0.4 + seed[i] * 1.3) * 0.14 * open
      const lz = loose[i3 + 2] * 0.7 + Math.sin(t * 0.45 + seed[i] * 0.7) * 0.14 * open

      let x = lx
      let y = ly
      let z = lz
      if (k > 0) {
        v.set(target[i3], target[i3 + 1], target[i3 + 2]).applyMatrix4(rot).multiplyScalar(scale)
        x += (v.x + centreX - lx) * k
        y += (v.y + centreY + bob - ly) * k
        z += (v.z - lz) * k
      }

      // Loose parts scatter from the cursor; folded ones only ripple.
      if (pt.active) {
        const proj = CAMERA_Z / (CAMERA_Z - z)
        const dx = x * proj - cx
        const dy = y * proj - cy
        const dist = Math.hypot(dx, dy)
        if (dist < R && dist > 1e-4) {
          const f = 1 - dist / R
          const amt = (f * f * 0.45 * (0.2 + 0.8 * open)) / proj
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
      dummy.scale.setScalar(size[i] * (0.75 + 0.25 * k) * scale)
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

export default function PlaneScene({ count, progressRef, active }) {
  const wrapRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      const x = ((e.clientX - r.left) / r.width) * 2 - 1
      const y = -(((e.clientY - r.top) / r.height) * 2 - 1)
      pointerRef.current.x = x
      pointerRef.current.y = y
      // Only react while the cursor is over or just beside the figure.
      pointerRef.current.active = Math.abs(x) <= 1.25 && Math.abs(y) <= 1.25
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
        camera={{ position: [0, 0, CAMERA_Z], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
        style={{ background: 'transparent' }}
      >
        <SceneFog near={6.8} far={10.6} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} />
        <directionalLight position={[-5, -2, -4]} intensity={0.9} />
        <Parts count={count} progressRef={progressRef} pointerRef={pointerRef} />
      </Canvas>
    </div>
  )
}
