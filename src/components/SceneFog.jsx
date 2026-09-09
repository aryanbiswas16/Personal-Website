import { useThemeColors } from '../lib/parts.js'

/** Fades far parts into the page background, so a cloud reads as depth instead of noise. */
export default function SceneFog({ near, far }) {
  const { bg } = useThemeColors()
  return <fog attach="fog" args={[bg, near, far]} />
}
