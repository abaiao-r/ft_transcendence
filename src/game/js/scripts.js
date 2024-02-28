import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// Touch
let fieldWidth = 40;
let fieldHeight = 30;
let height = 1;
let paddleLength = 2;
let paddleWidth = 0.4;
let paddleWallDist = 2;
let ballRadius = 0.3;
let paddleSpeed = 2;
let ballSpeed = 0.1;
// DON'T TOUCH
let paddleTotalDist = fieldWidth / 2 - paddleWallDist - paddleWidth / 2;
let lerpStep = 0.1;
let ballSpeedX = {value: 0};
let ballSpeedY = {value: 0};
let stepX = {value: 0};
let stepY = {value: 0};
let clock = new THREE.Clock();
var delta = 0;
var ticks = 0;

// Key states
let keys = {
	ArrowUp: false,
	ArrowDown: false,
	w: false,
	s: false
  };

// Create renderer instance with antialias
const renderer = new THREE.WebGLRenderer({antialias: true});

// Enable shadows
renderer.shadowMap.enabled = true;

// Change the background color
renderer.setClearColor(0x333333);

// Define the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// Inject canvas element into the page
document.body.appendChild(renderer.domElement);

// Add background
const scene = new THREE.Scene();

// Add camera
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

// Change camera position along the x, y ands z axes
camera.position.set(0, 10, 40);

// Instantiate the orbit control class with the camera
// COMMENT
const orbit = new OrbitControls(camera, renderer.domElement);

// Whenever the camera position is changed, orbit MUST update
// COMMENT
orbit.update();

// Simple coordinate guide
// COMMENT
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Add plane
const planeGeometry = new THREE.PlaneGeometry(fieldWidth, fieldHeight);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Plane receives shadows
plane.receiveShadow = true;

// Adding ambient light
const ambientLight = new THREE.AmbientLight(0x666666);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(0, -30, 50);
// Light must cast shadows, otherwise the rest of the shadow configurations won't work
directionalLight.castShadow = true;
// Increasing the size of the the shadow camera
directionalLight.shadow.camera.top = fieldHeight / 2;
directionalLight.shadow.camera.bottom = -fieldHeight / 2;
directionalLight.shadow.camera.right = fieldWidth / 2 + height;
directionalLight.shadow.camera.left = -fieldWidth / 2 - height;

// Add directional light helper to visualize source
// Second argument defines the size
const dLIghtHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLIghtHelper);

// Add helper for the shadow camera
const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

// Standard material for reuse
const standardMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000});

// Adding boxes for edges
const boxGeometry1 = new THREE.BoxGeometry(height, fieldHeight + height * 2, height);
const boxGeometry2 = new THREE.BoxGeometry(fieldWidth + height * 2, height, height);
const box_r = new THREE.Mesh(boxGeometry1, standardMaterial);
const box_l = new THREE.Mesh(boxGeometry1, standardMaterial);
const box_t = new THREE.Mesh(boxGeometry2, standardMaterial);
const box_b = new THREE.Mesh(boxGeometry2, standardMaterial);
scene.add(box_r);
scene.add(box_l);
scene.add(box_t);
scene.add(box_b);
box_r.position.set(fieldWidth / 2 + height / 2, 0, height / 2);
box_l.position.set(-fieldWidth / 2 - height / 2, 0, height / 2);
box_t.position.set(0, fieldHeight / 2 + height / 2, height / 2);
box_b.position.set(0, -fieldHeight / 2 - height / 2, height / 2);
box_r.castShadow = true;
box_l.castShadow = true;
box_t.castShadow = true;
box_b.castShadow = true;
box_r.receiveShadow = true;
box_l.receiveShadow = true;
box_t.receiveShadow = true;
box_b.receiveShadow = true;

// Adding fancy corners
const cornerGeometry = new THREE.OctahedronGeometry(height * 0.7, 0);
const corner1 = new THREE.Mesh(cornerGeometry, standardMaterial);
const corner2 = new THREE.Mesh(cornerGeometry, standardMaterial);
const corner3 = new THREE.Mesh(cornerGeometry, standardMaterial);
const corner4 = new THREE.Mesh(cornerGeometry, standardMaterial);
scene.add(corner1);
scene.add(corner2);
scene.add(corner3);
scene.add(corner4);
corner1.rotateZ(Math.PI / 4);
corner2.rotateZ(Math.PI / 4);
corner3.rotateZ(Math.PI / 4);
corner4.rotateZ(Math.PI / 4);
corner1.position.set(-fieldWidth / 2 - height / 2, fieldHeight / 2 + height / 2, height);
corner2.position.set(fieldWidth / 2 + height / 2, fieldHeight / 2 + height / 2, height);
corner3.position.set(-fieldWidth / 2 - height / 2, -fieldHeight / 2 - height / 2, height);
corner4.position.set(fieldWidth / 2 + height / 2, -fieldHeight / 2 - height / 2, height);
corner1.castShadow = true;
corner2.castShadow = true;
corner3.castShadow = true;
corner4.castShadow = true;
corner1.receiveShadow = true;
corner2.receiveShadow = true;
corner3.receiveShadow = true;
corner4.receiveShadow = true;

// Adding paddles
const paddleLeftGeometry = new THREE.BoxGeometry(paddleWidth, paddleLength, height);
const paddleRightGeometry = new THREE.BoxGeometry(paddleWidth, paddleLength, height);
const paddleMaterial = new THREE.MeshStandardMaterial({color: 0x0000FF});
const paddleLeft = new THREE.Mesh(paddleLeftGeometry, paddleMaterial);
const paddleRight = new THREE.Mesh(paddleRightGeometry, paddleMaterial);
paddleRight.position.set(fieldWidth / 2 - paddleWallDist, 0, height / 2);
paddleLeft.position.set(-fieldWidth / 2 + paddleWallDist, 0, height / 2);
paddleLeft.castShadow = true;
paddleRight.castShadow = true;
paddleLeft.receiveShadow = true;
paddleRight.receiveShadow = true;
scene.add(paddleLeft);
scene.add(paddleRight);

// Adding ball
const sphereGeometry = new THREE.SphereGeometry(ballRadius);
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x00FF00});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.position.set(0, 0, ballRadius);

// Listen for key press
window.addEventListener('keydown', function(e) {
	if (e.key in keys) {
		keys[e.key] = true;
	}
});

// Listen for key release
window.addEventListener('keyup', function(e) {
	if (e.key in keys) {
		keys[e.key] = false;
	}
});

function move(){
	if (keys.ArrowUp && !keys.ArrowDown && paddleRight.position.y < fieldHeight / 2 - paddleLength / 2 - lerpStep) {
		paddleRight.position.lerp(new THREE.Vector3(paddleRight.position.x, paddleRight.position.y + lerpStep, paddleRight.position.z), paddleSpeed);
	}
	if (keys.ArrowDown && !keys.ArrowUp && paddleRight.position.y > -fieldHeight / 2 + paddleLength / 2 + lerpStep) {
		paddleRight.position.lerp(new THREE.Vector3(paddleRight.position.x, paddleRight.position.y - lerpStep, paddleRight.position.z), paddleSpeed);
	}
	if (keys.w && !keys.s && paddleLeft.position.y < fieldHeight / 2 - paddleLength / 2 - lerpStep) {
		paddleLeft.position.lerp(new THREE.Vector3(paddleLeft.position.x, paddleLeft.position.y + lerpStep, paddleLeft.position.z), paddleSpeed);
	}
	if (keys.s && !keys.w && paddleLeft.position.y > -fieldHeight / 2 + paddleLength / 2 + lerpStep) {
		paddleLeft.position.lerp(new THREE.Vector3(paddleLeft.position.x, paddleLeft.position.y - lerpStep, paddleLeft.position.z), paddleSpeed);
	}
}

// Defines ball direction at the beginning and resets
function ballStart(){
	sphere.position.set(0, 0, ballRadius);
	let rand = Math.random() * 2 - 1;
	stepY.value = rand != 0 ? rand : 1;
	rand = (Math.random() * 0.5 + 0.5) * (Math.random() < 0.5 ? -1 : 1);
	stepX.value = rand != 0 ? rand : 1;
	let magnitude = Math.sqrt(stepX.value * stepX.value + stepY.value * stepY.value)
	stepX.value = stepX.value / magnitude;
	stepY.value = stepY.value / magnitude;
	ballSpeedX = Math.abs(ballSpeed * stepX.value);
	ballSpeedY = Math.abs(ballSpeed * stepY.value);
}

// Checking for collisions
function collision() {
	if ((sphere.position.x + ballRadius >= paddleTotalDist && sphere.position.x + ballRadius <= paddleTotalDist + lerpStep
		&& ((sphere.position.y >= paddleRight.position.y && paddleRight.position.y + paddleLength / 2 >= sphere.position.y)
		|| (sphere.position.y <= paddleRight.position.y && paddleRight.position.y - paddleLength / 2 <= sphere.position.y)))
		|| (sphere.position.x - ballRadius <= -paddleTotalDist && sphere.position.x - ballRadius >= -paddleTotalDist - lerpStep
		&& ((sphere.position.y >= paddleLeft.position.y && paddleLeft.position.y + paddleLength / 2 >= sphere.position.y)
		|| (sphere.position.y <= paddleLeft.position.y && paddleLeft.position.y - paddleLength / 2 <= sphere.position.y)))){
		stepX.value *= -1;
	}
	else if (sphere.position.x + ballRadius >= fieldWidth / 2
		|| sphere.position.x - ballRadius <= -fieldWidth / 2){
		ballStart();
	}
	else if (sphere.position.y + ballRadius >= fieldHeight / 2
		|| sphere.position.y - ballRadius <= -fieldHeight / 2){
		stepY.value *= -1;
	}
	// NEED MORE CASES FOR COLLISIONS WITH EDGES OF PADDLES
}

function updateGameLogic(){
	sphere.position.x += ballSpeedX * stepX.value;
	sphere.position.y += ballSpeedY * stepY.value;
	move();
	collision();
}

ballStart();

function animate() {
	// Updates game movement and collisions twice per frame
	// Simulating 120 tick server
	delta = clock.getDelta();
	ticks = Math.round(delta / (1 / 120));

	for (let i = 0; i < ticks; i++){
	    updateGameLogic(delta / ticks);
	};
	// The render method links the camera and the scene
	renderer.render(scene, camera);
}

// Pass the animate function to the render so it displays motion
renderer.setAnimationLoop(animate);

// Make the canvas responsive (change size automatically)
window.addEventListener('resize', function() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});