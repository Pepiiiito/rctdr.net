import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/STLLoader.js';

const canvas = document.getElementById('model-canvas');
const loadingState = document.getElementById('loading-state');
const hotspotInfo = document.getElementById('hotspot-info');
const explodeSlider = document.getElementById('explode-range');
const explodeLabel = document.getElementById('explode-label');
const playBtn = document.getElementById('play-guided');
const pauseBtn = document.getElementById('pause-guided');
const fileInput = document.getElementById('file-input');
const loadBtn = document.getElementById('load-btn');
const resetBtn = document.getElementById('reset-btn');

if (!canvas) return;

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f8fb);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
renderer.localClippingEnabled = true;

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
camera.position.set(3.2, 2.2, 3.2);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.enableZoom = false; // avoid wheel zoom so the page can scroll
controls.screenSpacePanning = true;
controls.target.set(0, 0.4, 0);

scene.add(new THREE.AmbientLight(0xced5df, 0.55));
const hemi = new THREE.HemisphereLight(0xe6ecf5, 0x0a0f16, 0.55);
scene.add(hemi);
const dir1 = new THREE.DirectionalLight(0xffffff, 0.45);
dir1.position.set(4, 6, 3);
scene.add(dir1);
const dir2 = new THREE.DirectionalLight(0xdde3eb, 0.25);
dir2.position.set(-3, 3, -2);
scene.add(dir2);

let currentMesh;
let partGroups = [];
const gltfLoader = new GLTFLoader();
const stlLoader = new STLLoader();

let needsRender = true;
let isAnimating = false;
let interactionAnimating = false;
let guidedPlaying = false;
let guidedIndex = 0;
let guidedStart = 0;
const guidedKeyframes = [
  { pos: new THREE.Vector3(2.8, 1.6, 2.8), target: new THREE.Vector3(0, 0.3, 0), dur: 2500 },
  { pos: new THREE.Vector3(0, 4.2, 0.1), target: new THREE.Vector3(0, 0, 0), dur: 2200 },
  { pos: new THREE.Vector3(-2.4, 1.2, -1.2), target: new THREE.Vector3(0, 0.2, -0.2), dur: 2400 },
  { pos: new THREE.Vector3(1.4, 1.1, 0.7), target: new THREE.Vector3(0, 0.35, 0.35), dur: 2200 },
  { pos: new THREE.Vector3(0.4, 1.8, -2.0), target: new THREE.Vector3(0, 0.25, 0), dur: 2400 }
];

function updateLoading(text) {
  if (loadingState) loadingState.textContent = text;
}

function fitCameraToObject(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());
  controls.target.copy(center);
  const distance = size * 0.8 / Math.tan((Math.PI * camera.fov) / 360);
  camera.position.copy(center.clone().add(new THREE.Vector3(distance, distance * 0.6, distance)));
  camera.lookAt(center);
}

// Remove current mesh and dispose resources
function clearCurrent() {
  if (currentMesh) {
    scene.remove(currentMesh);
    currentMesh.traverse?.((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    });
    currentMesh = null;
  }
  partGroups.forEach((g) => scene.remove(g));
  partGroups = [];
}

// Neutral placeholder if no model is available
function addPlaceholder() {
  clearCurrent();
  const geo = new THREE.BoxGeometry(1.1, 0.35, 2.4);
  const mat = new THREE.MeshStandardMaterial({ color: 0xb8c3ce, metalness: 0.05, roughness: 0.48 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0.2;
  scene.add(mesh);
  currentMesh = mesh;
  partGroups = [mesh];
  fitCameraToObject(mesh);
  updateLoading('Sense model carregat. Usa "Selecciona fitxer".');
  requestRender();
}

// Try loading an external model URL (glb/gltf or stl)
async function tryLoad(url, type) {
  if (type === 'glb') {
    const glb = await gltfLoader.loadAsync(url);
    clearCurrent();
    currentMesh = glb.scene;
    scene.add(currentMesh);
    fitCameraToObject(currentMesh);
    buildParts(currentMesh);
    updateLoading('');
    requestRender();
    return true;
  }
  if (type === 'stl') {
    const buf = await (await fetch(url)).arrayBuffer();
    loadArrayBuffer(buf, 'stl');
    return true;
  }
  return false;
}

// Load first available default model from the assets list; fallback to placeholder
async function loadDefaultModel() {
  const candidates = [
    { url: 'assets/rc-car.stl', type: 'stl' },
    { url: 'assets/rc-car.glb', type: 'glb' },
    { url: 'assets/rc-car.gltf', type: 'glb' },
    { url: 'assets/model.glb', type: 'glb' },
    { url: 'assets/model.stl', type: 'stl' }
  ];
  for (const c of candidates) {
    try {
      await tryLoad(c.url, c.type);
      return;
    } catch (_) { /* ignore and try next */ }
  }
  addPlaceholder();
}

// Load from raw ArrayBuffer (drag-drop or file input)
function loadArrayBuffer(buffer, ext) {
  clearCurrent();
  if (ext === 'stl') {
    const geo = stlLoader.parse(buffer);
    const mat = new THREE.MeshStandardMaterial({ color: 0xc3ccd6, metalness: 0.08, roughness: 0.48 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.position.y = 0;
    scene.add(mesh);
    currentMesh = mesh;
    fitCameraToObject(mesh);
    buildParts(mesh);
    updateLoading('');
    if (explodeSlider) applyExplode(Number(explodeSlider.value) / 100);
    requestRender();
  } else {
    gltfLoader.parse(buffer, '', (gltf) => {
      currentMesh = gltf.scene;
      scene.add(currentMesh);
      fitCameraToObject(currentMesh);
      buildParts(currentMesh);
      updateLoading('');
      if (explodeSlider) applyExplode(Number(explodeSlider.value) / 100);
      requestRender();
    }, () => addPlaceholder());
  }
}

function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['glb', 'gltf', 'stl'].includes(ext)) {
    alert('Format no suportat. Usa .glb/.gltf o .stl');
    return;
  }
  updateLoading('Carregant...');
  const reader = new FileReader();
  reader.onload = (e) => {
    const buffer = e.target.result;
    loadArrayBuffer(buffer, ext === 'stl' ? 'stl' : 'glb');
  };
  reader.readAsArrayBuffer(file);
}

// Keep renderer and camera in sync with canvas size
function resize() {
  const { clientWidth, clientHeight } = canvas;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  requestRender();
}

function render() {
  controls.update();
  renderer.render(scene, camera);
  needsRender = false;
}

function requestRender() {
  needsRender = true;
  if (!isAnimating) render();
}

// Render loop when animating guided path
function runGuided(now) {
  if (!guidedPlaying) {
    isAnimating = false;
    return;
  }
  isAnimating = true;
  const t = now ?? performance.now();
  const kf = guidedKeyframes[guidedIndex];
  const nextIndex = (guidedIndex + 1) % guidedKeyframes.length;
  const kfNext = guidedKeyframes[nextIndex];
  const dt = kf.dur;
  const elapsed = (t - guidedStart);
  const alpha = Math.min(elapsed / dt, 1);
  const eased = alpha * alpha * (3 - 2 * alpha); // smoothstep
  camera.position.lerpVectors(kf.pos, kfNext.pos, eased);
  controls.target.lerpVectors(kf.target, kfNext.target, eased);
  controls.update();
  renderer.render(scene, camera);
  if (alpha >= 1) {
    guidedIndex = nextIndex;
    guidedStart = t;
  }
  requestAnimationFrame(runGuided);
}

function startGuided() {
  if (guidedPlaying) return;
  guidedPlaying = true;
  autoSpin = false;
  guidedStart = performance.now();
  guidedIndex = 0;
  runGuided();
}

function pauseGuided() {
  guidedPlaying = false;
  setTimeout(() => { autoSpin = true; }, 600);
}

// Simple auto-spin when idle (applied to loaded parts/mesh)
let autoSpin = true;
let lastSpin = performance.now();
function spinLoop(now) {
  const dt = Math.min((now - lastSpin) / 1000, 0.05);
  lastSpin = now;
  if (autoSpin && !interactionAnimating && !guidedPlaying) {
    const targets = partGroups.length ? partGroups : currentMesh ? [currentMesh] : [];
    targets.forEach((obj) => { obj.rotation.y += dt * 0.4; });
    requestRender();
  }
  requestAnimationFrame(spinLoop);
}

// Hotspot focus presets
const focusPoints = {
  chassis: { pos: new THREE.Vector3(1.8, 1.4, 2.1), target: new THREE.Vector3(0, 0.2, 0) },
  steering: { pos: new THREE.Vector3(1.2, 1.0, 0.8), target: new THREE.Vector3(0, 0.4, 0.4) },
  transmission: { pos: new THREE.Vector3(-1.6, 1.2, -0.6), target: new THREE.Vector3(0, 0.2, -0.2) },
  electronics: { pos: new THREE.Vector3(0.6, 1.6, -1.8), target: new THREE.Vector3(0, 0.3, 0) }
};

function setFocus(key) {
  const preset = focusPoints[key];
  if (!preset) return;
  camera.position.copy(preset.pos);
  controls.target.copy(preset.target);
  controls.update();
  autoSpin = false;
  setTimeout(() => { autoSpin = true; }, 1200);
  flashHighlight(key);
  requestRender();
}

function updateHotspotText(key) {
  const map = {
    chassis: 'Xassís: plataforma PLA/PETG, tram central compactat.',
    steering: 'Direcció: servo directe, ranura de tolerància i topall del tubet.',
    transmission: 'Transmissió: engranatge helicoidal 35/15, eix amb topalls.',
    electronics: 'Electrònica: motor + ESC QuickRun, LiPo 2200 mAh, cablatge centrat.'
  };
  if (hotspotInfo) hotspotInfo.textContent = map[key] || 'Punt sense descripció.';
}

// Build conceptual parts for exploded/highlight
function buildParts(root) {
  partGroups = [];
  const objs = [];
  root.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: 0xc3ccd6,
        metalness: 0.08,
        roughness: 0.48,
        clippingPlanes: child.material?.clippingPlanes || []
      });
      objs.push(child);
    }
  });
  if (objs.length === 0) return;

  const groups = { chassis: [], transmission: [], steering: [], wheels: [], electronics: [] };
  objs.forEach((m) => {
    const name = (m.name || '').toLowerCase();
    if (name.includes('wheel') || name.includes('tire') || name.includes('tyre')) groups.wheels.push(m);
    else if (name.includes('gear') || name.includes('trans') || name.includes('drive')) groups.transmission.push(m);
    else if (name.includes('steer') || name.includes('servo')) groups.steering.push(m);
    else if (name.includes('esc') || name.includes('battery') || name.includes('lipo') || name.includes('pcb')) groups.electronics.push(m);
    else groups.chassis.push(m);
  });

  const hasMultiple = objs.length > 1 && (groups.chassis.length + groups.transmission.length + groups.steering.length + groups.wheels.length + groups.electronics.length) > 1;
  if (hasMultiple) {
    partGroups = Object.entries(groups)
      .filter(([, arr]) => arr.length)
      .map(([key, arr]) => {
        const g = new THREE.Group();
        arr.forEach((m) => g.add(m));
        g.userData.part = key;
        return g;
      });
    partGroups.forEach((g) => scene.add(g));
  } else {
    // Single mesh: create clipped clones into conceptual parts
    const base = objs[0];
    const bbox = new THREE.Box3().setFromObject(base);
    const size = bbox.getSize(new THREE.Vector3());
    const { min, max } = bbox;
    const band = size.z * 0.2;
    const midZ1 = min.z + band;
    const midZ2 = max.z - band;
    const planesForRange = (mn, mx) => ([
      new THREE.Plane(new THREE.Vector3(1, 0, 0), -mn.x),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), mx.x),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -mn.y),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), mx.y),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), -mn.z),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), mx.z)
    ]);

    const ranges = {
      chassis: { min: new THREE.Vector3(min.x, min.y, min.z + band), max: new THREE.Vector3(max.x, max.y, max.z - band) },
      transmission: { min: new THREE.Vector3(min.x, min.y, min.z), max: new THREE.Vector3(max.x, max.y, midZ1) },
      steering: { min: new THREE.Vector3(min.x, min.y, midZ2), max: new THREE.Vector3(max.x, max.y, max.z) },
      wheels: { min: new THREE.Vector3(min.x, min.y, min.z), max: new THREE.Vector3(max.x, max.y, max.z) } // fallback whole
    };

    Object.entries(ranges).forEach(([key, r]) => {
      const clone = base.clone();
      clone.material = base.material.clone();
      clone.material.clippingPlanes = planesForRange(r.min, r.max);
      clone.material.clipIntersection = true;
      clone.userData.part = key;
      partGroups.push(clone);
      scene.add(clone);
    });

    base.visible = false; // avoid double render
  }
}

function applyExplode(factor) {
  if (!partGroups || partGroups.length === 0) return;
  const offsets = {
    chassis: new THREE.Vector3(0, 0.15, 0),
    transmission: new THREE.Vector3(-0.25, 0.05, -0.35),
    steering: new THREE.Vector3(0.25, 0.05, 0.35),
    wheels: new THREE.Vector3(0.35, 0, 0.35),
    electronics: new THREE.Vector3(0, 0.25, 0)
  };
  partGroups.forEach((g) => {
    const key = g.userData.part || 'chassis';
    const off = offsets[key] || new THREE.Vector3(0, 0.1, 0);
    g.position.copy(off.clone().multiplyScalar(factor));
  });
}

function flashHighlight(key) {
  const targetParts = partGroups.filter((g) => (g.userData.part || '').includes(key));
  if (targetParts.length === 0) return;
  targetParts.forEach((g) => {
    g.traverse((m) => {
      if (m.isMesh) {
        const mat = m.material;
        mat.emissive = mat.emissive || new THREE.Color(0x000000);
        mat._oldEmissive = mat.emissive.clone();
        mat.emissive.set(0x0f4d92);
      }
    });
  });
  setTimeout(() => {
    targetParts.forEach((g) => g.traverse((m) => {
      if (m.isMesh && m.material._oldEmissive) {
        m.material.emissive.copy(m.material._oldEmissive);
      }
    }));
    requestRender();
  }, 800);
  requestRender();
}

// Bind UI
loadBtn?.addEventListener('click', () => fileInput?.click());
fileInput?.addEventListener('change', (e) => {
  if (e.target.files.length) handleFile(e.target.files[0]);
});
resetBtn?.addEventListener('click', () => loadDefaultModel());

canvas.addEventListener('dragover', (e) => { e.preventDefault(); });
canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

document.querySelectorAll('[data-focus]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setFocus(btn.dataset.focus);
    updateHotspotText(btn.dataset.focus);
  });
});

playBtn?.addEventListener('click', startGuided);
pauseBtn?.addEventListener('click', pauseGuided);

explodeSlider?.addEventListener('input', (e) => {
  const val = Number(e.target.value) / 100;
  explodeLabel.textContent = `Explosió: ${Math.round(val * 100)}%`;
  applyExplode(val);
  requestRender();
});

function throttledRender() {
  if (needsRender && !isAnimating) render();
}

controls.addEventListener('change', () => { needsRender = true; throttledRender(); });
controls.addEventListener('start', () => {
  interactionAnimating = true;
  autoSpin = false;
  runInteractionLoop();
});
controls.addEventListener('end', () => {
  interactionAnimating = false;
  // resume spin a moment after user stops interacting
  setTimeout(() => { autoSpin = true; }, 600);
});

function runInteractionLoop() {
  if (!interactionAnimating || guidedPlaying) return;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(runInteractionLoop);
}

window.addEventListener('resize', resize);

resize();
loadDefaultModel();
render();
requestAnimationFrame(spinLoop);
