/**
 * Simplified WarpShader for testing
 * Uses a basic gradient shader to verify WebGL setup works
 */

export function initWarpShaderSimple(options = {}) {
  const {
    containerId = 'warp-shader-container',
    colors = ['#b8fff7', '#6e3466', '#0133ff', '#66d1fe']
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`WarpShader: Container #${containerId} not found`);
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
      let material, mesh;
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

      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      // Simple animated gradient shader for testing
      const fragmentShader = `
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          
          // Animated gradient mixing
          float t = uTime * 0.5;
          vec2 center = uv - 0.5;
          float angle = atan(center.y, center.x);
          float radius = length(center);
          
          float mix1 = 0.5 + 0.5 * sin(angle * 2.0 + t);
          float mix2 = 0.5 + 0.5 * cos(radius * 10.0 + t * 0.8);
          float mix3 = 0.5 + 0.5 * sin(t * 0.6);
          
          vec3 color = mix(uColor1, uColor2, mix1);
          color = mix(color, uColor3, mix2);
          color = mix(color, uColor4, mix3 * 0.5);
          
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

        scene = new Scene();
        camera = new OrthographicCamera(-aspect, aspect, 1, -1, 0, 1);

        renderer = new WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        renderer.domElement.style.cssText = `
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        `;

        material = new ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new Vector2(width, height) },
            uColor1: { value: new Vector3(...color1) },
            uColor2: { value: new Vector3(...color2) },
            uColor3: { value: new Vector3(...color3) },
            uColor4: { value: new Vector3(...color4) }
          },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader
        });

        const geometry = new PlaneGeometry(2 * aspect, 2);
        mesh = new Mesh(geometry, material);
        scene.add(mesh);
        
        console.log('Simple WarpShader: Initialized successfully');
      }

      function resize() {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const aspect = width / height;

        if (renderer) {
          renderer.setSize(width, height);
        }
        if (camera) {
          camera.left = -aspect;
          camera.right = aspect;
          camera.updateProjectionMatrix();
        }
        if (material) {
          material.uniforms.uResolution.value.set(width, height);
        }
        if (mesh) {
          const newGeometry = new PlaneGeometry(2 * aspect, 2);
          mesh.geometry.dispose();
          mesh.geometry = newGeometry;
        }
      }

      function animate() {
        animationId = requestAnimationFrame(animate);
        const time = (performance.now() - startTime) * 0.001;

        if (material && material.uniforms) {
          material.uniforms.uTime.value = time;
        }

        if (scene && camera && renderer) {
          renderer.render(scene, camera);
        }
      }

      try {
        init();
        window.addEventListener('resize', resize);
        animate();
        console.log('Simple WarpShader: Animation started');
      } catch (error) {
        console.error('Simple WarpShader error:', error);
        container.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
      }

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resize);
        if (renderer && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
        if (material) material.dispose();
        if (mesh && mesh.geometry) mesh.geometry.dispose();
      };
    } catch (error) {
      console.error('Simple WarpShader initialization error:', error);
      container.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
    }
  }).catch((error) => {
    console.error('Failed to load Three.js:', error);
    container.style.cssText = `position: absolute; inset: 0; background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 100%); z-index: 0;`;
  });
}

