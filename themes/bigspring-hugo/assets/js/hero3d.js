// Minimal Three.js hero fabric-like wave
// Desktop only; respect reduced-motion and coarse pointer in caller

function createGradientMaterial() {
  // Simple standard material tuned to brand palette
  return new THREE.MeshStandardMaterial({
    color: 0x0aa8a7,
    metalness: 0.15,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });
}

function initHero3D(mount) {
  if (!window.THREE) return null;
  const isCoarse = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isCoarse ? 1 : 1.5));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x031a28, 20, 60);

  const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  const hemi = new THREE.HemisphereLight(0x9fd3ff, 0x06131b, 1.0);
  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(2, 3, 2);
  scene.add(hemi, dir);

  let seg = window.innerWidth > 1200 ? 200 : 140;
  if (isCoarse) seg = Math.round(seg * 0.6);
  const geo = new THREE.PlaneGeometry(12, 8, seg, Math.round(seg * 0.8));
  const mat = createGradientMaterial();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -0.25;
  scene.add(mesh);

  const pos = geo.attributes.position;
  const base = pos.array.slice();
  let t = 0, raf;

  function animate() {
    t += 0.01;
    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const x = base[ix];
      const y = base[ix + 1];
      const z = 0.6 * Math.sin(0.6 * x + t) + 0.4 * Math.cos(0.7 * y - t * 1.2);
      pos.array[ix + 2] = z;
    }
    pos.needsUpdate = true;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  function onResize() {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // Mouse parallax
  mount.addEventListener('mousemove', (e) => {
    const r = mount.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width * 2 - 1;
    const py = (e.clientY - r.top) / r.height * 2 - 1;
    camera.position.x = px * 0.5;
    camera.position.y = -py * 0.3;
    camera.lookAt(0, 0, 0);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(animate);
  });

  raf = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(raf);
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
}

// expose globally when included via non-module script tag
if (typeof window !== 'undefined') {
  window.initHero3D = initHero3D;
}


