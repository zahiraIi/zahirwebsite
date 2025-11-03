/**
 * WarpShader component - Vanilla JS port
 * Warp/distortion shader background using Three.js
 * Ported from @paper-design/shaders-react Warp component
 */

export function initWarpShader(options = {}) {
  const {
    containerId = 'warp-shader-container',
    proportion = 0.45,
    softness = 1.0,
    distortion = 0.25,
    swirl = 0.8,
    swirlIterations = 10,
    shape = 'checks',
    shapeScale = 0.1,
    scale = 1.0,
    rotation = 0.0,
    speed = 1.0,
    colors = ['#b8fff7', '#6e3466', '#0133ff', '#66d1fe']
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`WarpShader: Container #${containerId} not found`);
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
        Vector2,
        Vector3
      } = THREE_MODULE;

      let scene, camera, renderer;
      let warpMaterial;
      let warpMesh;
      let animationId;
      let startTime;

      // Convert hex colors to RGB
      function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
      }

      const color1 = hexToRgb(colors[0] || '#b8fff7');
      const color2 = hexToRgb(colors[1] || '#6e3466');
      const color3 = hexToRgb(colors[2] || '#0133ff');
      const color4 = hexToRgb(colors[3] || '#66d1fe');

      // Vertex shader
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      // Fragment shader - Improved Warp effect
      const fragmentShader = `
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uProportion;
        uniform float uSoftness;
        uniform float uDistortion;
        uniform float uSwirl;
        uniform float uSwirlIterations;
        uniform float uShapeScale;
        uniform float uScale;
        uniform float uRotation;
        uniform float uSpeed;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        varying vec2 vUv;

        vec2 rotate2D(vec2 v, float angle) {
          float s = sin(angle);
          float c = cos(angle);
          return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
        }

        float checkerPattern(vec2 uv) {
          vec2 grid = floor(uv / uShapeScale);
          return mod(grid.x + grid.y, 2.0);
        }

        vec2 warpUV(vec2 uv) {
          vec2 centered = uv - 0.5;
          
          // Normalize coordinates - use aspect to maintain square shapes
          float aspect = uResolution.x / uResolution.y;
          vec2 scaled = centered;
          scaled.x *= aspect;
          
          // Calculate distance from center
          float dist = length(scaled);
          
          // Apply swirl distortion - multiple iterations
          float angle = 0.0;
          for (float i = 0.0; i < 10.0; i++) {
            float weight = step(i, uSwirlIterations - 1.0);
            float phase = uTime * uSpeed * 0.5 + i * 0.3;
            angle += weight * uSwirl * sin(phase + dist * 4.0) * 0.2;
          }
          
          // Apply base swirl
          angle += uSwirl * dist * 1.5;
          scaled = rotate2D(scaled, angle);
          
          // Apply distortion waves
          float waveTime = uTime * uSpeed;
          float waveAmount = uDistortion * 0.1;
          scaled += vec2(
            sin(scaled.y * 6.0 + waveTime) * waveAmount,
            cos(scaled.x * 6.0 + waveTime * 0.8) * waveAmount
          );
          
          // Apply scale
          scaled /= uScale;
          
          // Apply rotation
          scaled = rotate2D(scaled, uRotation + waveTime * 0.1);
          
          // Restore aspect
          scaled.x /= aspect;
          
          return scaled + 0.5;
        }

        void main() {
          vec2 uv = vUv;
          
          // Warp the UV coordinates
          vec2 warpedUV = warpUV(uv);
          
          // Create checker pattern
          float pattern = 0.0;
          if (uShapeScale > 0.001) {
            pattern = checkerPattern(warpedUV);
          } else {
            pattern = length(warpedUV - 0.5) * 2.0;
          }
          
          // Apply softness for smoother edges
          float edge = uSoftness * 0.15;
          pattern = smoothstep(0.5 - edge, 0.5 + edge, pattern);
          
          // Calculate animated color mixing
          vec2 center = uv - 0.5;
          float angle = atan(center.y, center.x);
          float radius = length(center);
          
          // Animated mixers based on position and time
          float t = uTime * uSpeed;
          float mix1 = 0.5 + 0.5 * sin(angle * 2.0 + t);
          float mix2 = 0.5 + 0.5 * cos(radius * 6.0 + t * 0.7);
          float mix3 = 0.5 + 0.5 * sin(pattern * 3.14159 + t * 0.5);
          
          // Apply proportion to control color mixing intensity
          mix1 = mix(0.5, mix1, uProportion);
          mix2 = mix(0.5, mix2, uProportion);
          mix3 = mix(0.5, mix3, uProportion * 0.4);
          
          // Blend colors with proper mixing
          vec3 color = mix(uColor1, uColor2, mix1);
          color = mix(color, uColor3, mix2);
          color = mix(color, uColor4, mix3);
          
          // Apply pattern overlay
          float patternMix = pattern * 0.2;
          color = mix(color, color * 0.85, patternMix);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `;

      function init() {
        const width = container.offsetWidth || window.innerWidth;
        const height = container.offsetHeight || window.innerHeight;
        
        if (width === 0 || height === 0) {
          throw new Error('Container has invalid dimensions');
        }
        
        const aspect = width / height;
        startTime = performance.now();

        // Create scene
        scene = new Scene();

        // Create orthographic camera
        camera = new OrthographicCamera(-aspect, aspect, 1, -1, 0, 1);

        // Create renderer
        renderer = new WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        
        const canvas = renderer.domElement;
        canvas.style.cssText = `
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
        `;
        
        container.appendChild(canvas);
        
        // Verify canvas dimensions
        if (canvas.width === 0 || canvas.height === 0) {
          console.warn('WarpShader: Canvas has zero dimensions', { width: canvas.width, height: canvas.height });
        } else {
          console.log('WarpShader: Canvas created', { width: canvas.width, height: canvas.height, pixelRatio: renderer.getPixelRatio() });
        }

        // Create warp material
        warpMaterial = new ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new Vector2(width, height) },
            uProportion: { value: proportion },
            uSoftness: { value: softness },
            uDistortion: { value: distortion },
            uSwirl: { value: swirl },
            uSwirlIterations: { value: swirlIterations },
            uShapeScale: { value: shapeScale },
            uScale: { value: scale },
            uRotation: { value: rotation },
            uSpeed: { value: speed },
            uColor1: { value: new Vector3(...color1) },
            uColor2: { value: new Vector3(...color2) },
            uColor3: { value: new Vector3(...color3) },
            uColor4: { value: new Vector3(...color4) }
          },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader
        });
        
        // Verify material was created
        if (!warpMaterial) {
          throw new Error('Failed to create shader material');
        }
        
        console.log('WarpShader: Material created', {
          hasUniforms: !!warpMaterial.uniforms,
          uniformCount: warpMaterial.uniforms ? Object.keys(warpMaterial.uniforms).length : 0,
          colors: [color1, color2, color3, color4]
        });

        // Create warp plane
        const warpGeometry = new PlaneGeometry(2 * aspect, 2);
        warpMesh = new Mesh(warpGeometry, warpMaterial);
        scene.add(warpMesh);
      }

      function resize() {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const aspect = width / height;

        if (renderer) {
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }

        if (camera) {
          camera.left = -aspect;
          camera.right = aspect;
          camera.updateProjectionMatrix();
        }

        if (warpMaterial) {
          warpMaterial.uniforms.uResolution.value.set(width, height);
        }

        if (warpMesh) {
          const newGeometry = new PlaneGeometry(2 * aspect, 2);
          warpMesh.geometry.dispose();
          warpMesh.geometry = newGeometry;
        }
      }

      let frameCount = 0;
      let lastTime = performance.now();
      
      function animate() {
        animationId = requestAnimationFrame(animate);
        const currentTime = performance.now();
        const time = (currentTime - startTime) * 0.001;
        const deltaTime = (currentTime - lastTime) * 0.001;
        lastTime = currentTime;

        if (warpMaterial && warpMaterial.uniforms && warpMaterial.uniforms.uTime) {
          warpMaterial.uniforms.uTime.value = time;
          
          // Log first few frames to verify animation is running
          if (frameCount < 5) {
            console.log(`WarpShader: Frame ${frameCount}, time=${time.toFixed(3)}, delta=${deltaTime.toFixed(3)}, FPS=${(1/deltaTime).toFixed(1)}`);
          }
        } else {
          if (frameCount === 1) {
            console.error('WarpShader: Material uniforms not accessible!', { warpMaterial, hasUniforms: !!warpMaterial?.uniforms });
          }
        }

        if (scene && camera && renderer) {
          try {
            renderer.render(scene, camera);
          } catch (renderError) {
            console.error('WarpShader: Render error:', renderError);
            cancelAnimationFrame(animationId);
          }
        }
        
        frameCount++;
        
        // Log if animation stops (shouldn't happen, but good for debugging)
        if (frameCount === 60) {
          console.log('WarpShader: Animation running (60 frames)');
        }
      }

      // Initialize
      try {
        init();
        window.addEventListener('resize', resize);
        animate();
      } catch (initError) {
        console.error('WarpShader init error:', initError);
        container.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
      }

      // Cleanup function
      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resize);
        if (renderer && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
        if (warpMaterial) warpMaterial.dispose();
        if (warpMesh && warpMesh.geometry) warpMesh.geometry.dispose();
      };
    } catch (error) {
      console.error('WarpShader initialization error:', error);
      container.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
    }
  }).catch((error) => {
    console.error('Failed to load Three.js:', error);
    container.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
  });
}
