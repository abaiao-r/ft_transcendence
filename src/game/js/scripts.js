// import * as THREE from 'three';
import {Clock,
	WebGLRenderer,
	Scene,
	PerspectiveCamera,
	PlaneGeometry,
	MeshStandardMaterial,
	Mesh,
	AmbientLight,
	DirectionalLight,
	SpotLight,
	DirectionalLightHelper,
	BoxGeometry,
	OctahedronGeometry,
	SphereGeometry,
	Vector3,
	MathUtils,
	DoubleSide} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {GUI} from 'dat.gui';

// Touch
let fieldWidth = 40;
let halfFieldWidth = fieldWidth / 2;
let fieldHeight = 30;
let halfFieldHeight = fieldHeight / 2;
let height = 1;
let chunkSize = fieldHeight / 10;
let paddleLength = 2;
let halfPaddleLength = paddleLength / 2;
let paddleWidth = 0.4;
let paddleWallDist = 2;
let ballRadius = 0.3;
let ballMaxAngle = Math.PI / 3; // 60 degrees
let paddleSpeed = 4;
let maxSpeed = 20;
let ballHitSpeed = 1.5;
let ballInitialSpeed = ballHitSpeed * 10;
let baseColor = 0xFF0000;
let pointColor = 0x00FF00;
let sphereColor = 0x0000FF;
let paddleColor = 0xFFFF00;
let gameDarkBlue = 0x1A213B;
let gameBlue = 0x10A2D3;
let gameRed = 0xF6525D;
let defaultCameraZ = 50;
let defaultCameraY = 10;
let orbitRadius = 15;
let orbitAngle = Math.PI / 16;
let orbitY = orbitRadius * Math.cos(orbitAngle);
// DON'T TOUCH
let ballSpeed = 0;
let paddleTotalDist = halfFieldWidth - paddleWallDist - paddleWidth / 2;
let lerpStep = 0.1;
let ballDirection = 0;
let text1;
let text2;
let text3;
let text4;
let lightsOn = false;
let startCam = false;
let start = false;
let clock = new Clock();
let delta = 0;
let ticks = 0;

// Key states
let keys = {
	ArrowUp: false,
	ArrowDown: false,
	w: false,
	s: false
};

// Create renderer instance with antialias
const renderer = new WebGLRenderer({antialias: true});

// Enable shadows
renderer.shadowMap.enabled = true;

// Change the background color
renderer.setClearColor(0x333333);

// Define the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// Inject canvas element into the page
document.body.appendChild(renderer.domElement);

// Add background
const scene = new Scene();

// Add camera
const camera = new PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

// Change camera position along the x, y ands z axes
camera.position.set(0, -10, 1);

// Instantiate the orbit control class with the camera
// COMMENT
const orbit = new OrbitControls(camera, renderer.domElement);

// Whenever the camera position is changed, orbit MUST update
// COMMENT
orbit.update();

// Simple coordinate guide
// COMMENT
// const axesHelper = new AxesHelper(5);
// scene.add(axesHelper);

// Add plane
const planeGeometry = new PlaneGeometry(fieldWidth, fieldHeight);
const planeMaterial = new MeshStandardMaterial({color: gameDarkBlue, side: DoubleSide});
const plane = new Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Plane receives shadows
plane.receiveShadow = true;

// Adding ambient light
const ambientLight = new AmbientLight(0x666666);
ambientLight.intensity = 0;
scene.add(ambientLight);

// Directional light
const directionalLight = new DirectionalLight(0xFFFFFF, 0);
scene.add(directionalLight);

directionalLight.position.set(0, -30, 50);
// Light must cast shadows, otherwise the rest of the shadow configurations won't work
directionalLight.castShadow = true;
// Increasing the size of the the shadow camera
directionalLight.shadow.camera.top = halfFieldHeight;
directionalLight.shadow.camera.bottom = -halfFieldHeight;
directionalLight.shadow.camera.right = halfFieldWidth + height;
directionalLight.shadow.camera.left = -halfFieldWidth - height;

// Spotlight
const spotlight1 = new SpotLight(0xFFFFFF, 400);
spotlight1.angle = 0;
spotlight1.position.set(0, orbitY, orbitRadius * Math.sin(orbitAngle));
scene.add(spotlight1);

// Add directional light helper to visualize source
// Second argument defines the size
// const dLIghtHelper = new DirectionalLightHelper(directionalLight, 5);
// scene.add(dLIghtHelper);

// Add helper for the shadow camera
// const dLightShadowHelper = new CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

// Standard material for reuse
const standardMaterial = new MeshStandardMaterial({color: gameBlue});
const scoreboardMaterial = new MeshStandardMaterial({color: pointColor});

// Adding boxes for edges
// const boxGeometry1 = new BoxGeometry(height, fieldHeight + height * 2, height);
const boxGeometry1 = new BoxGeometry(height, chunkSize, height);
const boxGeometry2 = new BoxGeometry(fieldWidth + height * 2, height, height);
const box_t = new Mesh(boxGeometry2, standardMaterial);
const box_b = new Mesh(boxGeometry2, standardMaterial);
// 10 chunks of sides to later behave as the scoreboard
const chunks_r = {
	box_r10 : new Mesh(boxGeometry1, standardMaterial),
	box_r9 : new Mesh(boxGeometry1, standardMaterial),
	box_r8 : new Mesh(boxGeometry1, standardMaterial),
	box_r7 : new Mesh(boxGeometry1, standardMaterial),
	box_r6 : new Mesh(boxGeometry1, standardMaterial),
	box_r5 : new Mesh(boxGeometry1, standardMaterial),
	box_r4 : new Mesh(boxGeometry1, standardMaterial),
	box_r3 : new Mesh(boxGeometry1, standardMaterial),
	box_r2 : new Mesh(boxGeometry1, standardMaterial),
	box_r1 : new Mesh(boxGeometry1, standardMaterial),
}
const chunks_l = {
	box_l10 : new Mesh(boxGeometry1, standardMaterial),
	box_l9 : new Mesh(boxGeometry1, standardMaterial),
	box_l8 : new Mesh(boxGeometry1, standardMaterial),
	box_l7 : new Mesh(boxGeometry1, standardMaterial),
	box_l6 : new Mesh(boxGeometry1, standardMaterial),
	box_l5 : new Mesh(boxGeometry1, standardMaterial),
	box_l4 : new Mesh(boxGeometry1, standardMaterial),
	box_l3 : new Mesh(boxGeometry1, standardMaterial),
	box_l2 : new Mesh(boxGeometry1, standardMaterial),
	box_l1 : new Mesh(boxGeometry1, standardMaterial),
}

for (let boxNumber in chunks_r){
	scene.add(chunks_r[boxNumber]);
	chunks_r[boxNumber].castShadow = true;
	chunks_r[boxNumber].receiveShadow = true;
}

for (let boxNumber in chunks_l){
	scene.add(chunks_l[boxNumber]);
	chunks_l[boxNumber].castShadow = true;
	chunks_l[boxNumber].receiveShadow = true;
}

for (let i = 1; i <= 10; i++){
	chunks_r[`box_r${i}`].position.set(halfFieldWidth + height / 2, halfFieldHeight - (2 * i - 1) * chunkSize / 2, height / 2);
	chunks_l[`box_l${i}`].position.set(-halfFieldWidth - height / 2, halfFieldHeight - (2 * i - 1) * chunkSize / 2, height / 2);
}

scene.add(box_t);
scene.add(box_b);
box_t.position.set(0, halfFieldHeight + height / 2, height / 2);
box_b.position.set(0, -halfFieldHeight - height / 2, height / 2);
box_t.castShadow = true;
box_b.castShadow = true;
box_t.receiveShadow = true;
box_b.receiveShadow = true;

// Adding fancy corners
const cornerGeometry = new OctahedronGeometry(height * 0.7, 0);
const corner1 = new Mesh(cornerGeometry, standardMaterial);
const corner2 = new Mesh(cornerGeometry, standardMaterial);
const corner3 = new Mesh(cornerGeometry, standardMaterial);
const corner4 = new Mesh(cornerGeometry, standardMaterial);
scene.add(corner1);
scene.add(corner2);
scene.add(corner3);
scene.add(corner4);
corner1.rotateZ(Math.PI / 4);
corner2.rotateZ(Math.PI / 4);
corner3.rotateZ(Math.PI / 4);
corner4.rotateZ(Math.PI / 4);
corner1.position.set(-halfFieldWidth - height / 2, halfFieldHeight + height / 2, height);
corner2.position.set(halfFieldWidth + height / 2, halfFieldHeight + height / 2, height);
corner3.position.set(-halfFieldWidth - height / 2, -halfFieldHeight - height / 2, height);
corner4.position.set(halfFieldWidth + height / 2, -halfFieldHeight - height / 2, height);
corner1.castShadow = true;
corner2.castShadow = true;
corner3.castShadow = true;
corner4.castShadow = true;
corner1.receiveShadow = true;
corner2.receiveShadow = true;
corner3.receiveShadow = true;
corner4.receiveShadow = true;

// Adding paddles
const paddleLeftGeometry = new BoxGeometry(paddleWidth, paddleLength, height);
const paddleRightGeometry = new BoxGeometry(paddleWidth, paddleLength, height);
const paddleMaterial = new MeshStandardMaterial({color: gameRed});
const paddleLeft = new Mesh(paddleLeftGeometry, paddleMaterial);
const paddleRight = new Mesh(paddleRightGeometry, paddleMaterial);
paddleRight.position.set(halfFieldWidth - paddleWallDist, 0, height / 2);
paddleLeft.position.set(-halfFieldWidth + paddleWallDist, 0, height / 2);
paddleLeft.castShadow = true;
paddleRight.castShadow = true;
paddleLeft.receiveShadow = true;
paddleRight.receiveShadow = true;
scene.add(paddleLeft);
scene.add(paddleRight);

// Adding ball
const sphereGeometry = new SphereGeometry(ballRadius);
const sphereMaterial = new MeshStandardMaterial({color: gameRed});
const sphere = new Mesh(sphereGeometry, sphereMaterial);
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
	if (!start){
		return;
	}
	if (keys.ArrowUp && !keys.ArrowDown && paddleRight.position.y < halfFieldHeight - halfPaddleLength - lerpStep) {
		paddleRight.position.lerp(new Vector3(paddleRight.position.x, paddleRight.position.y + lerpStep, paddleRight.position.z), paddleSpeed);
	}
	if (keys.ArrowDown && !keys.ArrowUp && paddleRight.position.y > -halfFieldHeight + halfPaddleLength + lerpStep) {
		paddleRight.position.lerp(new Vector3(paddleRight.position.x, paddleRight.position.y - lerpStep, paddleRight.position.z), paddleSpeed);
	}
	if (keys.w && !keys.s && paddleLeft.position.y < halfFieldHeight - halfPaddleLength - lerpStep) {
		paddleLeft.position.lerp(new Vector3(paddleLeft.position.x, paddleLeft.position.y + lerpStep, paddleLeft.position.z), paddleSpeed);
	}
	if (keys.s && !keys.w && paddleLeft.position.y > -halfFieldHeight + halfPaddleLength + lerpStep) {
		paddleLeft.position.lerp(new Vector3(paddleLeft.position.x, paddleLeft.position.y - lerpStep, paddleLeft.position.z), paddleSpeed);
	}
}

// Defines ball direction at the beginning and resets
function ballStart(){
	sphere.position.set(0, 0, ballRadius);
	ballSpeed = ballInitialSpeed;
	// Direction in radians to later decompose in x and y
	let rand = MathUtils.randFloatSpread(2.0 * ballMaxAngle);
	let rand2 = Math.random();
	ballDirection = rand2 >= 0.5 ? rand : rand + Math.PI;
}

function checkAlignment(paddle){
	return sphere.position.y - ballRadius < paddle.position.y + halfPaddleLength && sphere.position.y + ballRadius > paddle.position.y - halfPaddleLength;
}

function paddleLeftCollision(){
	return sphere.position.x - ballRadius < -paddleTotalDist && sphere.position.x - ballRadius > -paddleTotalDist - paddleWidth;
}

function paddleRightCollision(){
	return sphere.position.x + ballRadius > paddleTotalDist && sphere.position.x + ballRadius < paddleTotalDist + paddleWidth;
}

function bounceSpeed(multiplier){
	let speed = ballSpeed * ballHitSpeed * (1 + multiplier);
	speed = speed > maxSpeed ? maxSpeed : speed;
	return speed;
}

function bounce(side, paddle){
	// The multiplier will act as a percentage.
	// The further the ball hits from the center of the paddle, the higher the multiplier
	let multiplier = Math.abs((sphere.position.y - paddle.position.y) / halfPaddleLength);
	ballSpeed = bounceSpeed(multiplier);
	ballDirection = (sphere.position.y - paddle.position.y) / (halfPaddleLength + ballRadius) * ballMaxAngle;
	if (side)
		ballDirection = Math.PI - ballDirection;
}

function collision() {
	if (checkAlignment(paddleLeft) && paddleLeftCollision()){
		bounce(0, paddleLeft);
	}
	else if (checkAlignment(paddleRight) && paddleRightCollision()){
		bounce(1, paddleRight);
	}
	else if (sphere.position.x + ballRadius >= halfFieldWidth){
		for (let boxNumber in chunks_l){
			if (chunks_l[boxNumber].material === standardMaterial){
				chunks_l[boxNumber].material = scoreboardMaterial;
				if (boxNumber === 'box_l1'){
					scene.remove(sphere)
					paddleSpeed = 0;
					start = false;
				}
				break;
			}
		}
		ballStart();
	}
	else if (sphere.position.x - ballRadius <= -halfFieldWidth){
		for (let boxNumber in chunks_r){
			if (chunks_r[boxNumber].material === standardMaterial){
				chunks_r[boxNumber].material = scoreboardMaterial;
				if (boxNumber === 'box_r1'){
					scene.remove(sphere)
					paddleSpeed = 0;
					start = false;
				}
				break;
			}
		}
		ballStart();
	}
	else if (sphere.position.y + ballRadius >= halfFieldHeight
		|| sphere.position.y - ballRadius <= -halfFieldHeight){
		ballDirection = -ballDirection;
	}
}

function updateBallPosition(delta){
	if (!start){
		return;
	}
	const distance = ballSpeed * delta;
	const increment = new Vector3(distance * Math.cos(ballDirection), distance * Math.sin(ballDirection), 0);
	sphere.position.add(increment);
}

function updateGameLogic(delta){
	move();
	updateBallPosition(delta);
	collision();
}

function adjustLights(){
	spotlight1.intensity -= delta * 100;
	if (spotlight1.intensity <= 0){
		scene.remove(spotlight1);
		if (directionalLight.intensity < 1){
			directionalLight.intensity += delta / 2;
			ambientLight.intensity += delta / 2;
		}
	}
}

function spotlightOrbit(){
	const rotSpeed = 0.02;
	spotlight1.position.y = orbitRadius * Math.cos(orbitAngle);
	spotlight1.position.z = orbitRadius * Math.sin(orbitAngle);
	orbitAngle += rotSpeed;
}

function lights(delta){
	if (spotlight1.angle < Math.PI / 64)
		spotlight1.angle += delta / 75;
	else if (spotlight1.position.y > -orbitY)
		spotlightOrbit();
	else
		lightsOn = true
}

function animateCamera() {
	if (!startCam || start)
		return;
	if (camera.position.z < defaultCameraZ)
		camera.position.lerp(new Vector3(camera.position.x, camera.position.y, camera.position.z + lerpStep * 2), 1);
	if (camera.position.y < defaultCameraY)
		camera.position.lerp(new Vector3(camera.position.x, camera.position.y + lerpStep / 1.2, camera.position.z), 1);
	camera.lookAt(0, 0, 0);
}

function animate() {
	delta = clock.getDelta();
	ticks =  Math.round( delta * 120);
	if (!lightsOn)
		lights(delta);
	else
		adjustLights(delta);
	if (camera.position.z != defaultCameraZ && camera.position.y != defaultCameraY)
	animateCamera();
	for (let i = 0; i < ticks ; i++)
		updateGameLogic( delta / ticks );
	// updateGameLogic(delta);
	// The render method links the camera and the scene
	renderer.render(scene, camera);
}

// COMMENT
// For dat.gui controls
const gui = new GUI();

const options = {
	ballMaxAngle: 60,
	paddleSpeed: 4,
	maxSpeed: 20,
	ballHitSpeed: 1.5,
	ballInitialSpeed: 10
};

gui.add(options, 'ballMaxAngle').min(0).max(90).step(1).onChange(function(value) {
	ballMaxAngle = value * Math.PI / 180;
});

gui.add(options, 'paddleSpeed').min(0).max(10).step(0.1).onChange(function(value) {
	paddleSpeed = value;
});

gui.add(options, 'maxSpeed').min(0).max(100).step(1).onChange(function(value) {
	maxSpeed = value;
});

gui.add(options, 'ballHitSpeed').min(0).max(10).step(0.1).onChange(function(value) {
	ballHitSpeed = value;
});

gui.add(options, 'ballInitialSpeed').min(0).max(100).step(1).onChange(function(value) {
	ballInitialSpeed = value;
});

// Make the canvas responsive (change size automatically)
window.addEventListener('resize', function() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !startCam) {
		startCam = true;
		scene.remove(text4);
	}
	else if (e.code === 'Space' && startCam && Math.floor(camera.position.z) == defaultCameraZ && Math.floor(camera.position.y) == defaultCameraY) {
        scene.remove(text1);
        scene.remove(text2);
        scene.remove(text3);
        start = true;
    }
});

function textDisplay(){
    const loader = new FontLoader();
	loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', function(font){
        const textGeometry1 = new TextGeometry('Press space to start', {
            font: font,
            size: 2,
            height: 0.5,
        });
        const textGeometry2 = new TextGeometry('W\n\n\n\nS', {
            font: font,
            size: 1,
            height: 0.5,
        });
        const textGeometry3 = new TextGeometry('   Up arrow\n\n\n\nDown arrow', {
            font: font,
            size: 1,
            height: 0.5,
        });
        const textGeometry4 = new TextGeometry('press space', {
            font: font,
            size: 1,
            height: 0.5,
        });
        const textMaterial = new MeshStandardMaterial({color: 0x000000});
        text1 = new Mesh(textGeometry1, textMaterial);
        text2 = new Mesh(textGeometry2, textMaterial);
        text3 = new Mesh(textGeometry3, textMaterial);
		text4 = new Mesh(textGeometry4, textMaterial);
		text1.position.set(-12, -5, 10);
		text1.receiveShadow = true;
		text2.position.set(-18.5, 3, 1);
		text2.receiveShadow = true;
		text3.position.set(12, 3, 1);
		text3.receiveShadow = true;
		text4.position.set(-3.6, halfFieldHeight, 0.2);
		text4.rotateX(Math.PI / 2);
        scene.add(text1);
        scene.add(text2);
        scene.add(text3);
		scene.add(text4);
    });
}

function main(){
	ballStart();
	textDisplay();
	// Pass the animate function to the renderer so it displays motion
	renderer.setAnimationLoop(animate);
}

main();
