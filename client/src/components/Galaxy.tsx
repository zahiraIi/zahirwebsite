import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Geometry, Program, Mesh, Vec3 } from 'ogl';

interface GalaxyProps {
  mouseRepulsion?: boolean;
  mouseInteraction?: boolean;
  density?: number;
  glowIntensity?: number;
  saturation?: number;
  hueShift?: number;
}

export default function Galaxy({
  mouseRepulsion = false,
  mouseInteraction = false,
  density = 1.0,
  glowIntensity = 0.6,
  saturation = 0.7,
  hueShift = 220,
}: GalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new Renderer({ canvas, alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 0, 15);

    const scene = new Transform();

    // Number of stars based on density
    const numStars = Math.floor(2000 * density);
    
    // Create star positions with random seed for twinkling
    const positions = new Float32Array(numStars * 3);
    const seeds = new Float32Array(numStars);
    const sizes = new Float32Array(numStars);
    
    for (let i = 0; i < numStars; i++) {
      // Distribute stars in a sphere
      const radius = 8 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random seed for each star's twinkle phase
      seeds[i] = Math.random() * 10;
      
      // Random sizes for depth variety
      sizes[i] = 2 + Math.random() * 4;
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      seed: { size: 1, data: seeds },
      aSize: { size: 1, data: sizes },
    });

    // Vertex shader with twinkling effect
    const vertex = `
      attribute vec3 position;
      attribute float seed;
      attribute float aSize;
      
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      
      varying float vTwinkle;
      varying float vBrightness;
      
      void main() {
        // Multiple frequency sine waves for natural twinkling
        float freq1 = 1.0 + seed * 0.5;
        float freq2 = 0.3 + seed * 0.3;
        float phase1 = seed * 6.28318;
        float phase2 = seed * 12.56636;
        
        // Combine multiple sine waves for complex twinkling
        float twinkle1 = sin(uTime * freq1 + phase1);
        float twinkle2 = sin(uTime * freq2 + phase2);
        
        // Slow pulsing + fast twinkling
        vTwinkle = 0.3 + 0.5 * twinkle1 + 0.2 * twinkle2;
        vBrightness = vTwinkle;
        
        // Vary point size based on twinkle
        gl_PointSize = aSize * (0.7 + 0.6 * vTwinkle);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader with glow and color
    const fragment = `
      precision highp float;
      
      uniform float uGlowIntensity;
      uniform float uSaturation;
      uniform float uHueShift;
      
      varying float vTwinkle;
      varying float vBrightness;
      
      vec3 hslToRgb(float h, float s, float l) {
        float c = (1.0 - abs(2.0 * l - 1.0)) * s;
        float x = c * (1.0 - abs(mod(h / 60.0, 2.0) - 1.0));
        float m = l - c / 2.0;
        
        vec3 rgb;
        if (h < 60.0) rgb = vec3(c, x, 0.0);
        else if (h < 120.0) rgb = vec3(x, c, 0.0);
        else if (h < 180.0) rgb = vec3(0.0, c, x);
        else if (h < 240.0) rgb = vec3(0.0, x, c);
        else if (h < 300.0) rgb = vec3(x, 0.0, c);
        else rgb = vec3(c, 0.0, x);
        
        return rgb + m;
      }
      
      void main() {
        // Create circular star shape
        vec2 coord = gl_PointCoord - 0.5;
        float dist = length(coord);
        
        if (dist > 0.5) discard;
        
        // Soft glow falloff
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha = pow(alpha, 1.5);
        
        // Add extra glow
        float glow = exp(-dist * 6.0) * uGlowIntensity;
        alpha = alpha + glow;
        
        // Color based on brightness and hue shift
        float hue = uHueShift + vBrightness * 40.0;
        vec3 color = hslToRgb(hue, uSaturation, 0.5 + vBrightness * 0.3);
        
        // Apply brightness and alpha
        gl_FragColor = vec4(color * vBrightness, alpha * vBrightness);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uHueShift: { value: hueShift },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });
    mesh.setParent(scene);

    // Mouse interaction
    const mouse = new Vec3();
    if (mouseInteraction) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation loop
    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Update time uniform for twinkling
      program.uniforms.uTime.value = time * 0.001;

      // Slowly rotate the entire star field
      scene.rotation.y = time * 0.00005;
      scene.rotation.x = Math.sin(time * 0.00003) * 0.1;

      renderer.render({ scene, camera });
    };

    // Handle resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ aspect: window.innerWidth / window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    animate(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mouseRepulsion, mouseInteraction, density, glowIntensity, saturation, hueShift]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
