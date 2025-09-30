import Galaxy from '../Galaxy'

export default function GalaxyExample() {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', background: '#000' }}>
      <Galaxy 
        mouseInteraction={true}
        density={1.2}
        glowIntensity={0.6}
        saturation={0.7}
        hueShift={220}
      />
    </div>
  )
}
