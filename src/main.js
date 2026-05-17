import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './style.css';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00111f);
scene.fog = new THREE.FogExp2(0x00111f, 0.012);
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,2000);
camera.position.set(0, 10, 40);
const renderer = new THREE.WebGLRenderer({
canvas: document.querySelector('#bg'),
antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const ambientLight = new THREE.AmbientLight(0x4ea8de,2.5);
scene.add(ambientLight);
const oceanLight = new THREE.PointLight(0xffffff,300,700);

oceanLight.position.set(20, 30, 20);
scene.add(oceanLight);
const abyssLight = new THREE.PointLight(0x023e8a,150,500);
abyssLight.position.set(0, -30, 0);

scene.add(abyssLight);

const loader = new THREE.TextureLoader();
const submarineTexture = loader.load('/texture.png');
submarineTexture.colorSpace = THREE.SRGBColorSpace;
submarineTexture.wrapS = THREE.RepeatWrapping;
submarineTexture.wrapT = THREE.RepeatWrapping;
submarineTexture.repeat.set(2, 1);
const bodyMaterial = new THREE.MeshStandardMaterial({
map: submarineTexture,
metalness: 0.6,
roughness: 0.5,
});

const metalMaterial = new THREE.MeshStandardMaterial({
color: 0x9aa0a6,
metalness: 1,
roughness: 0.35,
});

const submarine = new THREE.Group();
const body = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 18, 64),bodyMaterial);
body.rotation.z = Math.PI / 2;
submarine.add(body);
const front = new THREE.Mesh(new THREE.SphereGeometry(2.8, 64, 64),metalMaterial);
front.scale.set(1.5, 1, 1);
front.position.x = 9;
submarine.add(front);
const back = new THREE.Mesh(new THREE.SphereGeometry(2.8, 64, 64),metalMaterial);
back.scale.set(1.5, 1, 1);
back.position.x = -9;
submarine.add(back);
const tower = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3),metalMaterial);
tower.position.set(0, 3, 0);

submarine.add(tower);
for(let i = -4; i <= 4; i += 2){
const glass = new THREE.Mesh(
new THREE.SphereGeometry(0.6, 32, 32),
new THREE.MeshPhysicalMaterial({
color: 0x90e0ef,
emissive: 0x0077b6,
emissiveIntensity: 4,
transmission: 1,
transparent: true,
opacity: 1,
roughness: 0,
metalness: 0,
})
);
glass.position.set(i, 0.5, 3);
submarine.add(glass);
}
for(let side of [-1, 1]){
const pipe = new THREE.Mesh(
new THREE.CylinderGeometry(0.25, 0.25, 12, 16),
new THREE.MeshStandardMaterial({
color: 0x9aa0a6,
metalness: 1,
roughness: 0.2,
})
);
pipe.rotation.z = Math.PI / 2;
pipe.position.set(0, -2, side * 2.8);
submarine.add(pipe);
}
const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5, 8),metalMaterial);
antenna.position.set(0, 6, 0);
submarine.add(antenna);
const rearFin = new THREE.Mesh(
new THREE.BoxGeometry(0.5, 5, 4),metalMaterial);
rearFin.position.set(-9, 0, 0);

submarine.add(rearFin);
const topFin = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 0.5),metalMaterial);
topFin.position.set(-7, 2.5, 0);
submarine.add(topFin);
const propellerGroup = new THREE.Group();
const propellerMaterial = new THREE.MeshStandardMaterial({
color: 0xffffff,
emissive: 0x444444,
emissiveIntensity: 0.2,
metalness: 1,
roughness: 0.08,
});
for(let i = 0; i < 4; i++){
const blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 0.8),propellerMaterial);
blade.rotation.x = (Math.PI / 2) * i;
propellerGroup.add(blade);
}

const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32),propellerMaterial);
hub.rotation.z = Math.PI / 2;
propellerGroup.add(hub);
propellerGroup.position.set(-12, 0, 0);
submarine.add(propellerGroup);
const headLight = new THREE.SpotLight(0x90e0ef,300,200,Math.PI / 8,0.5);
headLight.position.set(12, 2, 0);
headLight.target.position.set(50, 0, 0);
submarine.add(headLight);
submarine.add(headLight.target);
submarine.position.set(0, 5, 0);
scene.add(submarine);
const floor = new THREE.Mesh(
new THREE.PlaneGeometry(500, 500),
new THREE.MeshStandardMaterial({
color: 0x1b4332,
side: THREE.DoubleSide,
})
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -20;
scene.add(floor);
const rockGroup = new THREE.Group();
for(let i = 0; i < 60; i++){
const geometry = new THREE.DodecahedronGeometry(Math.random() * 2 + 1,1);
geometry.scale(Math.random() * 2 + 1,Math.random() * 1.5 + 0.5,Math.random() * 2 + 1);

const rock = new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({
color: 0x495057,
flatShading: true,
roughness: 1,})
);
rock.position.set(Math.random() * 250 - 125,-18,Math.random() * 250 - 125);
rock.rotation.set(Math.random(),Math.random(),Math.random());
rockGroup.add(rock);
  }

scene.add(rockGroup);
const coralGroup = new THREE.Group();
for(let i = 0; i < 120; i++){
const coralCluster = new THREE.Group();
const coralColor = new THREE.Color(Math.random() * 0.5 + 0.5,Math.random() * 0.3 + 0.2,Math.random() * 0.5 + 0.5);
for(let j = 0; j < 6; j++){
const branch = new THREE.Mesh(
new THREE.CylinderGeometry(0.08,0.18,Math.random() * 2 + 1,8),
new THREE.MeshStandardMaterial({
color: coralColor,
emissive: coralColor,
emissiveIntensity: 0.15,
roughness: 1,
})
);
branch.position.y = Math.random() * 1.5;
branch.rotation.z =
Math.random() * Math.PI * 0.5;
branch.rotation.x =
Math.random() * Math.PI * 0.5;
branch.position.x =
Math.random() * 1 - 0.5;
branch.position.z =
Math.random() * 1 - 0.5;
coralCluster.add(branch);
  }
coralCluster.position.set(Math.random() * 250 - 125,-19,Math.random() * 250 - 125);
coralGroup.add(coralCluster);
}
for(let i = 0; i < 80; i++){
const tubeCluster = new THREE.Group();
const tubeColor = new THREE.Color(0.8,Math.random() * 0.5,Math.random());

for(let j = 0; j < 5; j++){
const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.25,Math.random() * 2 + 1,16,1,true),
new THREE.MeshStandardMaterial({
color: tubeColor,
emissive: tubeColor,
emissiveIntensity: 0.1,
side: THREE.DoubleSide,
roughness: 1,
})
);
tube.position.x =Math.random() * 1.2 - 0.6;
tube.position.z =Math.random() * 1.2 - 0.6;
tube.position.y =Math.random() * 0.5;
tubeCluster.add(tube);
 }
tubeCluster.position.set(Math.random() * 250 - 125,-19,Math.random() * 250 - 125);
coralGroup.add(tubeCluster);
  }
for(let i = 0; i < 50; i++){
const fan = new THREE.Mesh(
new THREE.CircleGeometry(Math.random() * 2 + 1,32),
new THREE.MeshStandardMaterial({
color: new THREE.Color(1,Math.random() * 0.5,Math.random() * 0.5 + 0.5),emissive: 0x441144,emissiveIntensity: 0.15,side: THREE.DoubleSide,transparent: true,opacity: 0.9,
})
);
fan.rotation.y = Math.random() * Math.PI;
fan.rotation.z =Math.random() * 0.5 - 0.25;
fan.position.set(Math.random() * 250 - 125,-16 + Math.random() * 3,Math.random() * 250 - 125);
coralGroup.add(fan);
}

for(let i = 0; i < 200; i++){
const plant = new THREE.Mesh(new THREE.PlaneGeometry(0.2,Math.random() * 4 + 2),
new THREE.MeshStandardMaterial({
color: 0x2d6a4f,
emissive: 0x112211,
side: THREE.DoubleSide,
transparent: true,
})
);
plant.position.set(Math.random() * 250 - 125,-18,Math.random() * 250 - 125);
plant.rotation.y = Math.random() * Math.PI;
coralGroup.add(plant);
 } 
scene.add(coralGroup);
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/red_coral.glb', (gltf) => {
const coralReef = gltf.scene;
coralReef.scale.set(150, 150, 150);
coralReef.position.set(0, -18, 0);
coralReef.rotation.x = -Math.PI / 4;
coralReef.rotation.y = 0;
scene.add(coralReef);
});
const bubbles = [];

for(let i = 0; i < 800; i++){
const bubble = new THREE.Mesh(
new THREE.SphereGeometry(0.06, 8, 8),
new THREE.MeshBasicMaterial({color: 0xffffff,transparent: true,opacity: 0.3,
})
);
bubble.position.set(Math.random() * 300 - 150,Math.random() * 120 - 60,Math.random() * 300 - 150);
bubbles.push(bubble);
scene.add(bubble);
}

function moveCamera(){
const t = document.body.getBoundingClientRect().top;
if(t > -500){
camera.position.x += (0 - camera.position.x) * 0.05;
camera.position.y += (8 - camera.position.y) * 0.05;
camera.position.z += (30 - camera.position.z) * 0.05;
camera.lookAt(submarine.position);
}
else if(t > -1500){
camera.position.x += (-20 - camera.position.x) * 0.05;
camera.position.y += (5 - camera.position.y) * 0.05;
camera.position.z += (20 - camera.position.z) * 0.05;
camera.lookAt(coralGroup.position);
}
else{
camera.position.x += (20 - camera.position.x) * 0.05;
camera.position.y += (3 - camera.position.y) * 0.05;
camera.position.z += (25 - camera.position.z) * 0.05;
camera.lookAt(rockGroup.position);
 }
}
document.body.onscroll = moveCamera;
function animate(){
requestAnimationFrame(animate);
submarine.position.y =Math.sin(Date.now() * 0.0015) * 1 + 5;
submarine.rotation.y += 0.002;
propellerGroup.rotation.x += 0.4;
coralGroup.rotation.y += 0.0005;
bubbles.forEach((bubble) => {
bubble.position.y += 0.03;
if(bubble.position.y > 40){
bubble.position.y = -20;
}
});
renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
camera.aspect =window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);
});
