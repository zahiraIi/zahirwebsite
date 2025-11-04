/**
 * FractalNoiseShader component - Vanilla JS
 * Noise-based fractal shader background using Three.js
 * Adapted from Liam Egan's 2018 shader
 * Colors: Dark blue background with white accents
 */

export function initFractalNoiseShader(options = {}) {
  const {
    containerId = 'fractal-noise-container',
    // Dark blue color scheme with white accents
    // Deep indigo/navy blue background with white highlights
    colors = ['#1a1f3d', '#2a3f5f', '#3a5f7f', '#ffffff'] // Dark Blue Base, Medium Blue, Light Blue, White Accent
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`FractalNoiseShader: Container #${containerId} not found`);
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
    const existingContainer = document.querySelector('#root') || document.body;
    if (existingContainer) {
      existingContainer.insertBefore(fallbackDiv, existingContainer.firstChild);
    }
    return;
  }

  // Load Three.js from CDN
  import('https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js').then((THREE_MODULE) => {
    try {
      const {
        Scene,
        OrthographicCamera,
        WebGLRenderer,
        ShaderMaterial,
        PlaneGeometry,
        Mesh,
        Vector2
      } = THREE_MODULE;

      let scene, camera, renderer;
      let material, mesh;
      let animationId;
      let startTime;

      // Vertex shader
      const vertexShader = `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `;

      // Fragment shader - Fractal noise pattern
      const fragmentShader = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        
        const int octaves = 6;
        const float seed = 43758.5453123;
        const float seed2 = 73156.8473192;
        
        vec2 random2(vec2 st, float seed){
          st = vec2(dot(st, vec2(127.1, 311.7)),
                    dot(st, vec2(269.5, 183.3)));
          return -1.0 + 2.0 * fract(sin(st) * seed);
        }
        
        // Value Noise by Inigo Quilez
        float noise(vec2 st, float seed) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(dot(random2(i + vec2(0.0, 0.0), seed), f - vec2(0.0, 0.0)), 
                         dot(random2(i + vec2(1.0, 0.0), seed), f - vec2(1.0, 0.0)), u.x),
                     mix(dot(random2(i + vec2(0.0, 1.0), seed), f - vec2(0.0, 1.0)), 
                         dot(random2(i + vec2(1.0, 1.0), seed), f - vec2(1.0, 1.0)), u.x), u.y);
        }
        
        float fbm1(in vec2 _st, float seed) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < octaves; i++) {
            v += a * noise(_st, seed);
            _st = rot * _st * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }
        
        float pattern(vec2 uv, float seed, float time, inout vec2 q, inout vec2 r) {
          q = vec2(fbm1(uv + vec2(0.0, 0.0), seed),
                    fbm1(uv + vec2(5.2, 1.3), seed));
          r = vec2(fbm1(uv + 4.0 * q + vec2(1.7 - time / 2.0, 9.2), seed),
                    fbm1(uv + 4.0 * q + vec2(8.3 - time / 2.0, 2.8), seed));
          vec2 s = vec2(fbm1(uv + 4.0 * r + vec2(21.7 - time / 2.0, 90.2), seed),
                        fbm1(uv + 4.0 * r + vec2(80.3 - time / 2.0, 20.8), seed));
          vec2 t = vec2(fbm1(uv + 4.0 * s + vec2(121.7 - time / 2.0, 90.2), seed),
                        fbm1(uv + 4.0 * s + vec2(180.3 - time / 2.0, 20.8), seed));
          float rtn = fbm1(uv + 4.0 * t, seed);
          rtn = clamp(rtn, 0.0, 0.5);
          return rtn;
        }
        
        vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
          uv *= 1.0 + dot(uv, uv) * 0.3;
          
          float time = u_time / 20.0;
          
          mat2 rot = mat2(cos(time), sin(time), -sin(time), cos(time));
          uv = rot * uv;
          uv *= 1.4 + sin(time) * 0.3;
          uv.x -= time;
          
          vec2 q = vec2(0.0, 0.0);
          vec2 r = vec2(0.0, 0.0);
          
          vec3 colour = vec3(pattern(uv, seed, time, q, r));
          float QR = clamp(dot(q, r), -1.0, 1.0);
          
          // Original color generation logic
          colour += vec3(
            (q.x + q.y) + QR * 30.0, 
            QR * 15.0, 
            r.x * r.y + QR * 5.0
          );
          
          colour += 0.1;
          colour = clamp(colour, 0.05, 1.0);
          
          // Dark blue color scheme with white accents
          // Deep indigo/navy blue tones with white highlights - deeper blues for richer tone
          vec3 darkBlue = vec3(0.08, 0.10, 0.22);            // Deeper dark blue base
          vec3 mediumBlue = vec3(0.13, 0.20, 0.32);         // Deeper medium blue
          vec3 lightBlue = vec3(0.18, 0.30, 0.42);           // Deeper light blue
          vec3 whiteAccent = vec3(1.0, 1.0, 1.0);             // #ffffff - White accents
          
          // Use original colour values to map to blue palette
          // Normalize the original colour to 0-1 range for mixing
          float intensity = length(colour);
          float normalizedIntensity = (intensity - 0.05) / 0.95; // Map from 0.05-1.0 to 0-1
          
          // Create subtle color variation based on UV position and noise patterns
          vec2 screenUV = gl_FragCoord.xy / u_resolution.xy;
          float angleShift = atan(uv.y, uv.x) / 3.14159; // -1 to 1 range
          float distanceFromCenter = length(uv) * 0.3;
          
          // Subtle color variation for depth
          float colorVariation = sin(angleShift * 3.14159 + time * 0.1 + distanceFromCenter) * 0.1 + 0.9;
          
          // Create color gradients based on intensity
          vec3 mappedColour;
          
          // Map based on intensity - darker areas use dark blue, brighter areas show light blue and white
          if (normalizedIntensity < 0.3) {
            // Dark range: blend dark blue to medium blue
            float t = normalizedIntensity / 0.3;
            mappedColour = mix(darkBlue, mediumBlue, t);
          } else if (normalizedIntensity < 0.6) {
            // Mid range: blend medium blue to light blue
            float t = (normalizedIntensity - 0.3) / 0.3;
            mappedColour = mix(mediumBlue, lightBlue, t);
          } else if (normalizedIntensity < 0.85) {
            // Upper-mid range: blend light blue with white accents
            float t = (normalizedIntensity - 0.6) / 0.25;
            mappedColour = mix(lightBlue, mix(lightBlue, whiteAccent, 0.4), t);
          } else {
            // Bright range: white accents for highlights
            float t = (normalizedIntensity - 0.85) / 0.15;
            mappedColour = mix(mix(lightBlue, whiteAccent, 0.4), whiteAccent, t);
          }
          
          // Add subtle color variation for depth
          mappedColour *= colorVariation;
          
          // Add white accent highlights based on intensity peaks
          float whiteHighlight = smoothstep(0.7, 0.95, normalizedIntensity);
          whiteHighlight *= smoothstep(0.3, 0.6, abs(sin(angleShift * 6.28318 + time * 0.2)));
          mappedColour = mix(mappedColour, whiteAccent, whiteHighlight * 0.3);
          
          // Add blue channel influence for more blue depth
          float blueInfluence = colour.b * 0.15;
          mappedColour = mix(mappedColour, lightBlue, blueInfluence);
          
          colour = mappedColour;
          colour = clamp(colour, 0.05, 1.0);
          
          // Slightly less darkening to maintain color vibrancy while keeping readability
          colour *= 0.80;
          
          // Enhance color saturation slightly for more vivid blues
          float luminance = dot(colour, vec3(0.299, 0.587, 0.114));
          colour = mix(vec3(luminance), colour, 1.15);
          
          // Original final color output
          gl_FragColor = vec4(colour + abs(colour) * 0.4, 1.0);
        }
      `;

      function init() {
        // Use lower resolution on mobile for better performance
        const isMobile = window.innerWidth <= 768;
        const scale = isMobile ? 0.5 : 1;
        
        const containerWidth = container.offsetWidth || window.innerWidth;
        const containerHeight = container.offsetHeight || window.innerHeight;
        
        if (containerWidth === 0 || containerHeight === 0) {
          throw new Error('Container has invalid dimensions');
        }
        
        const width = containerWidth * scale;
        const height = containerHeight * scale;
        const aspect = width / height;
        startTime = performance.now();

        scene = new Scene();
        camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        renderer = new WebGLRenderer({
          antialias: !isMobile, // Disable antialias on mobile for performance
          alpha: true,
          powerPreference: 'high-performance'
        });
        
        renderer.setSize(width, height);
        // Adaptive pixel ratio: limit on mobile to reduce GPU work
        const maxPR = isMobile ? 1.25 : 2;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPR));
        renderer.setClearColor(0x000000, 0); // Transparent background for proper alpha blending
        
        const canvas = renderer.domElement;
        canvas.style.cssText = `
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          image-rendering: ${isMobile ? 'pixelated' : 'auto'};
        `;
        
        container.appendChild(canvas);

        material = new ShaderMaterial({
          uniforms: {
            u_resolution: { value: new Vector2(width, height) },
            u_time: { value: 0 }
          },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader
        });

        const geometry = new PlaneGeometry(2, 2);
        mesh = new Mesh(geometry, material);
        scene.add(mesh);
        
        console.log('FractalNoiseShader: Initialized successfully', { 
          scale, 
          isMobile, 
          canvasSize: { width, height },
          containerSize: { width: containerWidth, height: containerHeight }
        });
      }

      function resize() {
        // Use lower resolution on mobile for better performance
        const isMobile = window.innerWidth <= 768;
        const scale = isMobile ? 0.5 : 1;
        
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        const width = containerWidth * scale;
        const height = containerHeight * scale;

        if (renderer) {
        renderer.setSize(width, height);
        const maxPR = isMobile ? 1.25 : 2;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPR));
        }

        if (material && material.uniforms) {
          material.uniforms.u_resolution.value.set(width, height);
        }
      }

      function animate() {
        // Cap FPS on mobile to ~30 to reduce load
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const targetDelta = isMobile ? (1000 / 30) : (1000 / 60);
        let last = animate._last || 0;
        const now = performance.now();
        const dt = now - last;
        if (dt < targetDelta) {
          animationId = requestAnimationFrame(animate);
          return;
        }
        animate._last = now;
        animationId = requestAnimationFrame(animate);
        
        const time = (now - startTime) * 0.001;

        if (material && material.uniforms && material.uniforms.u_time) {
          material.uniforms.u_time.value = time;
        }

        if (scene && camera && renderer) {
          renderer.render(scene, camera);
        }
      }

      // Pause when tab hidden to save resources
      function handleVisibility() {
        if (document.hidden) {
          if (animationId) cancelAnimationFrame(animationId);
          animationId = null;
        } else if (!animationId) {
          animate._last = 0;
          animate();
        }
      }

      try {
        init();
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', handleVisibility);
        animate();
      } catch (error) {
        console.error('FractalNoiseShader error:', error);
        container.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
      }

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', handleVisibility);
        
        if (renderer) {
          const canvas = renderer.domElement;
          if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
          
          // Proper WebGL context cleanup
          const gl = renderer.getContext();
          if (gl) {
            const loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
              loseContext.loseContext();
            }
          }
          
          renderer.dispose();
        }
        
        if (material) material.dispose();
        if (mesh && mesh.geometry) mesh.geometry.dispose();
      };
    } catch (error) {
      console.error('FractalNoiseShader initialization error:', error);
      container.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
    }
  }).catch((error) => {
    console.error('Failed to load Three.js:', error);
    container.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
  });
}

