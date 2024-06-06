import * as THREE from 'three';
import { DRACOLoader, GLTFLoader, OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';

const canvas = document.querySelector(".webgl");
const spotlightInputs = document.getElementsByClassName("spotlight-control");

// FLOOR TEXTURE, SKYBOX, MODEL PATHS
const FLOOR_TEXTURE_PATH = "resources/textures/worn_planks_diff_1k.jpg";
const SKYBOX_PATH = "resources/environment/abandoned_parking_1k.hdr";
const MODEL_PATH = "resources/gltf/SAMPLE\ 1/RENDER\ 1.gltf";

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x505050);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 0.76;

document.body.appendChild(renderer.domElement);

// SETUP CAMERA
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 2, 7);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
// controls.maxDistance = 10;
// controls.minDistance = 2;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.update();

// SETUP SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const floorTexture = new THREE.TextureLoader().load(FLOOR_TEXTURE_PATH);
floorTexture.repeat = new THREE.Vector2(1, 1);
floorTexture.wrapS = THREE.ReplaceWrapping;
floorTexture.wrapT = THREE.ReplaceWrapping;
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({
        map: floorTexture
}));
plane.rotation.x = -Math.PI / 2;
plane.position.set(0, -0.3, 0);
plane.receiveShadow = true;
scene.add(plane);

// const ambient = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(ambient);

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(10, 20, -5).normalize();
// light.castShadow = true;
// scene.add(light);
// const dLightHelper = new THREE.DirectionalLightHelper(light);
// scene.add(dLightHelper);

const spotlight = new THREE.SpotLight(0xEFC070, 1);
spotlight.position.set(0, 1, 0).normalize();
spotlight.castShadow = true;
const spotlightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlight, spotlightHelper);
console.log(spotlightInputs);
for (var input of spotlightInputs) {
    input.value = spotlight.intensity;
    input.addEventListener("change", () => {
        console.log(input.type + ": input.value = " + input.value);
        spotlight.intensity = input.value;
        for (var x of spotlightInputs) if (input != x) x.value = spotlight.intensity;
    });
}


const hdriLoader = new RGBELoader()
hdriLoader.load(SKYBOX_PATH, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("node_modules/three/examples/jsm/libs/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(MODEL_PATH, (gltf) => {
    const mesh = gltf.scene;
    console.log(mesh);
    mesh.position.z = 0.3;
    mesh.position.y = -0.3;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.traverse((child) => {
        if (child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.envMapIntensity = 1;
        }
    });
    scene.add(mesh);
});

// RENDER LOOP

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

// Events
window.addEventListener('resize', () => {
  // Resize camera aspect ratio and renderer size to the new window size
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();