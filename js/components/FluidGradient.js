/**
 * FluidGradient component - Vanilla JS port
 * Fluid simulation background using Three.js
 * Ported from React Three Fiber to vanilla Three.js
 */

export function initFluidGradient(options = {}) {
  const {
    containerId = 'fluid-gradient-container',
    brushSize = 25.0,
    brushStrength = 0.5,
    distortionAmount = 2.5,
    fluidDecay = 0.98,
    trailLength = 0.8,
    stopDecay = 0.85,
    color1 = '#b8fff7',
    color2 = '#6e3466',
    color3 = '#0133ff',
    color4 = '#66d1fe',
    colorIntensity = 1.0,
    softness = 1.0,
    lerpFactor = 0.1
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`FluidGradient: Container #${containerId} not found`);
    return;
  }

  // Load Three.js from CDN
  import('https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js').then((THREE_MODULE) => {
    // Three.js exports named exports, use them directly
    const {
      Scene,
      OrthographicCamera,
      WebGLRenderer,
      WebGLRenderTarget,
      ShaderMaterial,
      PlaneGeometry,
      Mesh,
      Vector2,
      Vector3,
      Vector4,
      RGBAFormat,
      FloatType,
      LinearFilter
    } = THREE_MODULE;
    
    const THREE = {
      Scene,
      OrthographicCamera,
      WebGLRenderer,
      WebGLRenderTarget,
      ShaderMaterial,
      PlaneGeometry,
      Mesh,
      Vector2,
      Vector3,
      Vector4,
      RGBAFormat,
      FloatType,
      LinearFilter
    };
    let scene, camera, renderer;
    let fluidMaterial, displayMaterial;
    let fluidMesh, displayMesh;
    let fluidTarget1, fluidTarget2;
    let currentFluidTarget, previousFluidTarget;
    let frameCount = 0;
    let animationId;

    const mouse = { x: 0, y: 0, prevX: 0, prevY: 0, active: false };
    const targetMouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };

    // Shaders
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fluidShader = `
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec4 iMouse;
      uniform int iFrame;
      uniform sampler2D iPreviousFrame;
      uniform float uBrushSize;
      uniform float uBrushStrength;
      uniform float uFluidDecay;
      uniform float uTrailLength;
      uniform float uStopDecay;
      varying vec2 vUv;

      vec2 ur, U;

      float ln(vec2 p, vec2 a, vec2 b) {
          return length(p-a-(b-a)*clamp(dot(p-a,b-a)/dot(b-a,b-a),0.,1.));
      }

      vec4 t(vec2 v, int a, int b) {
          return texture2D(iPreviousFrame, fract((v+vec2(float(a),float(b)))/ur));
      }

      vec4 t(vec2 v) {
          return texture2D(iPreviousFrame, fract(v/ur));
      }

      float area(vec2 a, vec2 b, vec2 c) {
          float A = length(b-c), B = length(c-a), C = length(a-b), s = 0.5*(A+B+C);
          return sqrt(s*(s-A)*(s-B)*(s-C));
      }

      void main() {
          U = vUv * iResolution;
          ur = iResolution.xy;

          if (iFrame < 1) {
              float w = 0.5+sin(0.2*U.x)*0.5;
              float q = length(U-0.5*ur);
              gl_FragColor = vec4(0.1*exp(-0.001*q*q),0,0,w);
          } else {
              vec2 v = U,
                   A = v + vec2( 1, 1),
                   B = v + vec2( 1,-1),
                   C = v + vec2(-1, 1),
                   D = v + vec2(-1,-1);

              for (int i = 0; i < 8; i++) {
                  v -= t(v).xy;
                  A -= t(A).xy;
                  B -= t(B).xy;
                  C -= t(C).xy;
                  D -= t(D).xy;
              }

              vec4 me = t(v);
              vec4 n = t(v, 0, 1),
                  e = t(v, 1, 0),
                  s = t(v, 0, -1),
                  w = t(v, -1, 0);
              vec4 ne = .25*(n+e+s+w);
              me = mix(t(v), ne, vec4(0.15,0.15,0.95,0.));
              me.z = me.z - 0.01*((area(A,B,C)+area(B,C,D))-4.);

              vec4 pr = vec4(e.z,w.z,n.z,s.z);
              me.xy = me.xy + 100.*vec2(pr.x-pr.y, pr.z-pr.w)/ur;

              me.xy *= uFluidDecay;
              me.z *= uTrailLength;

              if (iMouse.z > 0.0) {
                  vec2 mousePos = iMouse.xy;
                  vec2 mousePrev = iMouse.zw;
                  vec2 mouseVel = mousePos - mousePrev;
                  float velMagnitude = length(mouseVel);
                  float q = ln(U, mousePos, mousePrev);
                  vec2 m = mousePos - mousePrev;
                  float l = length(m);
                  if (l > 0.0) m = min(l, 10.0) * m / l;

                  float brushSizeFactor = 1e-4 / uBrushSize;
                  float strengthFactor = 0.03 * uBrushStrength;

                  float falloff = exp(-brushSizeFactor*q*q*q);
                  falloff = pow(falloff, 0.5);

                  me.xyw += strengthFactor * falloff * vec3(m, 10.);

                  if (velMagnitude < 2.0) {
                      float distToCursor = length(U - mousePos);
                      float influence = exp(-distToCursor * 0.01);
                      float cursorDecay = mix(1.0, uStopDecay, influence);
                      me.xy *= cursorDecay;
                      me.z *= cursorDecay;
                  }
              }

              gl_FragColor = clamp(me, -0.4, 0.4);
          }
      }
    `;

    const displayShader = `
      uniform float iTime;
      uniform vec2 iResolution;
      uniform sampler2D iFluid;
      uniform float uDistortionAmount;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uColor4;
      uniform float uColorIntensity;
      uniform float uSoftness;
      varying vec2 vUv;

      void main() {
        vec2 fragCoord = vUv * iResolution;

        vec4 fluid = texture2D(iFluid, vUv);
        vec2 fluidVel = fluid.xy;

        float mr = min(iResolution.x, iResolution.y);
        vec2 uv = (fragCoord * 2.0 - iResolution.xy) / mr;

        uv += fluidVel * (0.5 * uDistortionAmount);

        float d = -iTime * 0.5;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
        }
        d += iTime * 0.5;

        float mixer1 = cos(uv.x * d) * 0.5 + 0.5;
        float mixer2 = cos(uv.y * a) * 0.5 + 0.5;
        float mixer3 = sin(d + a) * 0.5 + 0.5;

        float smoothAmount = clamp(uSoftness * 0.1, 0.0, 0.9);
        mixer1 = mix(mixer1, 0.5, smoothAmount);
        mixer2 = mix(mixer2, 0.5, smoothAmount);
        mixer3 = mix(mixer3, 0.5, smoothAmount);

        vec3 col = mix(uColor1, uColor2, mixer1);
        col = mix(col, uColor3, mixer2);
        col = mix(col, uColor4, mixer3 * 0.4);

        col *= uColorIntensity;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    }

    function init() {
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      // Create scene
      scene = new Scene();

      // Create orthographic camera
      const aspect = width / height;
      camera = new OrthographicCamera(-aspect, aspect, 1, -1, 0, 1);

      // Create renderer
      renderer = new WebGLRenderer({ 
        antialias: true,
        alpha: true 
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // Create render targets
      fluidTarget1 = new WebGLRenderTarget(width, height, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
        type: FloatType,
      });

      fluidTarget2 = new WebGLRenderTarget(width, height, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
        type: FloatType,
      });

      currentFluidTarget = fluidTarget1;
      previousFluidTarget = fluidTarget2;

      // Create fluid material
      fluidMaterial = new ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Vector2(width, height) },
          iMouse: { value: new Vector4(0, 0, 0, 0) },
          iFrame: { value: 0 },
          iPreviousFrame: { value: null },
          uBrushSize: { value: brushSize },
          uBrushStrength: { value: brushStrength },
          uFluidDecay: { value: fluidDecay },
          uTrailLength: { value: trailLength },
          uStopDecay: { value: stopDecay },
        },
        vertexShader: vertexShader,
        fragmentShader: fluidShader,
      });

      // Create display material
      displayMaterial = new ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Vector2(width, height) },
          iFluid: { value: null },
          uDistortionAmount: { value: distortionAmount },
          uColor1: { value: new Vector3(...hexToRgb(color1)) },
          uColor2: { value: new Vector3(...hexToRgb(color2)) },
          uColor3: { value: new Vector3(...hexToRgb(color3)) },
          uColor4: { value: new Vector3(...hexToRgb(color4)) },
          uColorIntensity: { value: colorIntensity },
          uSoftness: { value: softness },
        },
        vertexShader: vertexShader,
        fragmentShader: displayShader,
      });

      // Create fluid plane (rendered to texture only)
      const fluidGeometry = new PlaneGeometry(2 * aspect, 2);
      fluidMesh = new Mesh(fluidGeometry, fluidMaterial);

      // Create display plane (rendered to screen)
      const displayGeometry = new PlaneGeometry(2 * aspect, 2);
      displayMesh = new Mesh(displayGeometry, displayMaterial);
      scene.add(displayMesh);
    }

    function handleMouseMove(e) {
      mouse.active = true;
      const rect = container.getBoundingClientRect();
      targetMouse.x = e.clientX - rect.left;
      targetMouse.y = rect.height - (e.clientY - rect.top);
    }

    function handleMouseEnter() {
      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.active = false;
      // Keep last position for smooth interpolation
    }

    function resize() {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const aspect = width / height;

      if (renderer) {
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
      }

      if (camera) {
        camera.left = -aspect;
        camera.right = aspect;
        camera.updateProjectionMatrix();
      }

      if (fluidTarget1 && fluidTarget2) {
        fluidTarget1.setSize(width, height);
        fluidTarget2.setSize(width, height);
      }

      if (fluidMaterial) {
        fluidMaterial.uniforms.iResolution.value.set(width, height);
      }

      if (displayMaterial) {
        displayMaterial.uniforms.iResolution.value.set(width, height);
      }

      if (fluidMesh && displayMesh) {
        const fluidGeo = new PlaneGeometry(2 * aspect, 2);
        fluidMesh.geometry.dispose();
        fluidMesh.geometry = fluidGeo;

        const displayGeo = new PlaneGeometry(2 * aspect, 2);
        displayMesh.geometry.dispose();
        displayMesh.geometry = displayGeo;
      }

      frameCount = 0;
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      // Lerp mouse position for smooth movement
      mouse.prevX = smoothMouse.x;
      mouse.prevY = smoothMouse.y;

      smoothMouse.x += (targetMouse.x - smoothMouse.x) * lerpFactor;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * lerpFactor;

      mouse.x = smoothMouse.x;
      mouse.y = smoothMouse.y;

      // Update fluid material uniforms
      if (fluidMaterial) {
        fluidMaterial.uniforms.iTime.value = time;
        fluidMaterial.uniforms.iFrame.value = frameCount;
        // Set mouse position (iMouse.z > 0.0 in shader checks for active mouse)
        // z and w are previous position, used to check if mouse is active
        fluidMaterial.uniforms.iMouse.value.set(
          mouse.x,
          mouse.y,
          mouse.active ? (mouse.prevX > 0 ? mouse.prevX : mouse.x) : 0,
          mouse.active ? (mouse.prevY > 0 ? mouse.prevY : mouse.y) : 0
        );
        fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
      }

      // Update display material uniforms
      if (displayMaterial) {
        displayMaterial.uniforms.iTime.value = time;
        displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
      }

      // Render fluid to texture
      if (fluidMesh && fluidMaterial) {
        renderer.setRenderTarget(currentFluidTarget);
        renderer.render(fluidMesh, camera);
        renderer.setRenderTarget(null);
      }

      // Render display to screen
      if (displayMesh && displayMaterial && scene) {
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
      }

      // Swap render targets
      const temp = currentFluidTarget;
      currentFluidTarget = previousFluidTarget;
      previousFluidTarget = temp;

      frameCount++;
    }

    // Initialize
    init();

    // Event listeners
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.active = true;
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        targetMouse.x = touch.clientX - rect.left;
        targetMouse.y = rect.height - (touch.clientY - rect.top);
      }
    });
    window.addEventListener('resize', resize);

    // Start animation
    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);

      if (renderer && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      if (renderer) {
        renderer.dispose();
      }

      if (fluidMaterial) fluidMaterial.dispose();
      if (displayMaterial) displayMaterial.dispose();
      if (fluidTarget1) fluidTarget1.dispose();
      if (fluidTarget2) fluidTarget2.dispose();
    };
  }).catch((error) => {
    console.error('Failed to load Three.js:', error);
    // Fallback: show gradient background
    container.style.background = 'linear-gradient(180deg, #b8fff7 0%, #6e3466 25%, #0133ff 50%, #66d1fe 100%)';
  });
}

