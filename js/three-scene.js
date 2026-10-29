/**
 * ========================================================
 * THREE.JS 3D BACKGROUND ENGINE
 * Floating 3D Hearts & Stardust Constellation
 * Mobile Optimized with Touch Parallax & Battery Saver
 * ========================================================
 */

(function () {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  let scene, camera, renderer, heartsGroup, starField;
  const heartsData = [];

  try {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false, // Antialias false saves massive mobile GPU fillrate
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(1.0); // 1.0 DPR runs silky smooth at 60fps on all phones
    renderer.setSize(window.innerWidth, window.innerHeight);
  } catch (err) {
    console.warn("WebGL not supported or restricted, falling back to CSS background", err);
    return;
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xff69b4, 1.2);
  dirLight1.position.set(5, 10, 7);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffd700, 1.0);
  dirLight2.position.set(-5, -5, 5);
  scene.add(dirLight2);

  // 1. Floating 3D Hearts Geometry
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
  heartShape.bezierCurveTo(-0.6, 0.3, -0.3, 0.6, 0, 1.0);
  heartShape.bezierCurveTo(0.3, 0.6, 0.6, 0.3, 0.6, 0);
  heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

  const extrudeSettings = {
    depth: 0.25,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08
  };

  const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  // Center heart origin
  heartGeo.center();

  // Materials for hearts (Metallic & Glossy)
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0xff2a85,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0x330018
    }),
    new THREE.MeshStandardMaterial({
      color: 0xf9d423,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x221800
    }),
    new THREE.MeshStandardMaterial({
      color: 0xda70d6,
      metalness: 0.2,
      roughness: 0.3,
      emissive: 0x200030
    })
  ];

  heartsGroup = new THREE.Group();
  const heartCount = 8; // Optimized for mobile 60fps

  for (let i = 0; i < heartCount; i++) {
    const mat = materials[i % materials.length];
    const mesh = new THREE.Mesh(heartGeo, mat);

    const x = (Math.random() - 0.5) * 22;
    const y = (Math.random() - 0.5) * 24;
    const z = (Math.random() - 0.5) * 12;
    mesh.position.set(x, y, z);

    const scale = 0.5 + Math.random() * 0.7;
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.x = Math.PI; // flip rightside up
    mesh.rotation.y = Math.random() * Math.PI * 2;

    heartsGroup.add(mesh);

    heartsData.push({
      mesh: mesh,
      rotSpeedX: (Math.random() - 0.5) * 0.015,
      rotSpeedY: 0.01 + Math.random() * 0.02,
      floatSpeed: 0.008 + Math.random() * 0.012,
      initialY: y,
      floatRange: 2 + Math.random() * 3,
      floatOffset: Math.random() * Math.PI * 2
    });
  }
  scene.add(heartsGroup);

  // 2. Cosmic Stardust Particles (Lightweight Constellation)
  const starGeo = new THREE.BufferGeometry();
  const starCount = 120;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const colorPalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xffd1dc),
    new THREE.Color(0xf9d423),
    new THREE.Color(0xe0b0ff)
  ];

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 40;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 25;

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    starColors[i * 3] = chosenColor.r;
    starColors[i * 3 + 1] = chosenColor.g;
    starColors[i * 3 + 2] = chosenColor.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // Parallax handling for mobile touch & gyro
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  window.addEventListener('mousemove', (e) => {
    targetRotY = ((e.clientX / window.innerWidth) - 0.5) * 0.6;
    targetRotX = ((e.clientY / window.innerHeight) - 0.5) * 0.6;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      targetRotY = ((touch.clientX / window.innerWidth) - 0.5) * 0.8;
      targetRotX = ((touch.clientY / window.innerHeight) - 0.5) * 0.8;
    }
  }, { passive: true });

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop with Page Visibility API
  let isTabActive = true;
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isTabActive) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth Parallax Lerp
    currentRotX += (targetRotX - currentRotX) * 0.05;
    currentRotY += (targetRotY - currentRotY) * 0.05;

    heartsGroup.rotation.y = currentRotY * 0.7;
    heartsGroup.rotation.x = currentRotX * 0.7;
    starField.rotation.y = elapsedTime * 0.02 + currentRotY * 0.3;
    starField.rotation.x = currentRotX * 0.3;

    // Animate Hearts
    for (let i = 0; i < heartsData.length; i++) {
      const d = heartsData[i];
      d.mesh.rotation.y += d.rotSpeedY;
      d.mesh.rotation.z += d.rotSpeedX;
      d.mesh.position.y = d.initialY + Math.sin(elapsedTime * d.floatSpeed * 50 + d.floatOffset) * d.floatRange;
    }

    renderer.render(scene, camera);
  }

  animate();
})();
