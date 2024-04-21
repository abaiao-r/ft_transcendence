// import * as THREE from 'three';
import {Clock,
	WebGLRenderer,
	Scene,
	PerspectiveCamera,
	PlaneGeometry,
	MeshStandardMaterial,
	Mesh,
	TextureLoader,
	CubeTextureLoader,
	AmbientLight,
	DirectionalLight,
	SpotLight,
	DirectionalLightHelper,
	CameraHelper,
	BoxGeometry,
	OctahedronGeometry,
	SphereGeometry,
	Vector3,
	MathUtils,
	DoubleSide,
	MeshBasicMaterial} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {
	getScore,
	loadScoreMeshes} from './scores.js';
import {GUI} from 'dat.gui';
import * as colors from './colors.js';
import img1 from '../avatars/impossibru.jpeg';
import img2 from '../avatars/oh_shit.jpeg';

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
let paddleSpeed = 1.5;
let maxSpeed = 30;
let minSpeed = 20;
let ballHitSpeed = 1.5;
let ballInitialSpeed = ballHitSpeed * 10;
let defaultCameraZ = 50;
let defaultCameraY = 0;
let orbitRadius = 15;
let orbitAngle = Math.PI / 16;
let orbitY = orbitRadius * Math.cos(orbitAngle);
let tabletSize = 5;
let pic1;
let pic2;
let camTime = 0;
let camOrbit = 20;
let camOrbitSpeed = 0.0;
let aiError = 1;
// DON'T TOUCH
let ballSpeed = 0;
let paddleTotalDist = halfFieldWidth - paddleWallDist - paddleWidth / 2;
let lerpStep = 0.1;
let ballDirection = 0;
let oldBallPosX = 0;
let oldBallPosY = 0;
let dX = 0;
let dY = 0;
let text1;
let text2;
let text3;
let text4;
let lightsOn;
let ready;
let startCam;
let start;
let clock;
let delta;
let ticks;
let interval;
// For testing specific palettes
let color = colors.olympic;
// let color = colors.selectRandomPalette();

let scores;
let scoreboard;
let bounceCount;
let cpu;
let timer;
let matchTime;

// Basics
let renderer;
let scene;
let camera;
let planeGeometry;
let planeMaterial;
let plane;
let ambientLight;
let directionalLight;
let spotlight1;
let standardMaterial;
let scoreboardMaterial;
let boxGeometry1;
let boxGeometry2;
let box_t;
let box_b;
let chunks_r;
let chunks_l;
let cornerGeometry;
let corner1;
let corner2;
let corner3;
let corner4;
let paddleLeftGeometry;
let paddleRightGeometry;
let paddleMaterial;
let paddleLeft;
let paddleRight;
let sphereGeometry;
let sphereMaterial;
let sphere;
let imgLoader;
let meshPromises;
let loader;

// Key states
let keys = {
	ArrowUp: false,
	ArrowDown: false,
	w: false,
	s: false
};

function prepareBasics(){
	// Create renderer instance with antialias
	renderer = new WebGLRenderer({antialias: true});

	// Enable shadows
	renderer.shadowMap.enabled = true;

	// Change the background color
	renderer.setClearColor(color.background);

	// Define the size of the renderer
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Check for old canvas and remove it to start a new game by appending a new one
	let gameContainer = document.getElementById('pong');
	let oldGame = gameContainer.querySelector('.renderer');
	if (oldGame)
		gameContainer.removeChild(oldGame);
	gameContainer.appendChild(renderer.domElement);
	renderer.domElement.classList.add('renderer');

	// Use this instead of the above when running directly with parcel
	// Inject canvas element into the page
	// document.body.appendChild(renderer.domElement);

	// Add background
	scene = new Scene();

	// Add camera
	camera = new PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	// Change camera position along the x, y ands z axes
	camera.position.set(0, -10, 1);

	// Instantiate the orbit control class with the camera
	// COMMENT
	// let orbit = new OrbitControls(camera, renderer.domElement);

	// Whenever the camera position is changed, orbit MUST update
	// COMMENT
	// orbit.update();

	// Simple coordinate guide
	// COMMENT
	// let axesHelper = new AxesHelper(5);
	// scene.add(axesHelper);
}

function preparePlane(){
	// Add plane
	planeGeometry = new PlaneGeometry(fieldWidth, fieldHeight);
	planeMaterial = new MeshStandardMaterial({color: color.field, side: DoubleSide});
	plane = new Mesh(planeGeometry, planeMaterial);
	scene.add(plane);

	// Plane receives shadows
	plane.receiveShadow = true;
}

function prepareLights(){
	// Adding ambient light
	ambientLight = new AmbientLight(0x666666);
	ambientLight.intensity = 0;
	scene.add(ambientLight);

	// Directional light
	directionalLight = new DirectionalLight(0xFFFFFF, 0);
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
	spotlight1 = new SpotLight(0xFFFFFF, 400);
	spotlight1.angle = 0;
	spotlight1.position.set(0, orbitY, orbitRadius * Math.sin(orbitAngle));
	scene.add(spotlight1);

	// Add directional light helper to visualize source
	// Second argument defines the size
	// let dLIghtHelper = new DirectionalLightHelper(directionalLight, 5);
	// scene.add(dLIghtHelper);

	// Add helper for the shadow camera
	// let dLightShadowHelper = new CameraHelper(directionalLight.shadow.camera);
	// scene.add(dLightShadowHelper);
}

function prepareField(){
	// Standard material for reuse
	standardMaterial = new MeshStandardMaterial({color: color.walls});
	scoreboardMaterial = new MeshStandardMaterial({color: color.points});

	// Adding boxes for edges
	boxGeometry1 = new BoxGeometry(height, chunkSize, height);
	boxGeometry2 = new BoxGeometry(fieldWidth + height * 2, height, height);
	box_t = new Mesh(boxGeometry2, standardMaterial);
	box_b = new Mesh(boxGeometry2, standardMaterial);
	// 10 chunks of sides to later behave as the scoreboard
	chunks_r = {
		box_r10: new Mesh(boxGeometry1, standardMaterial),
		box_r9: new Mesh(boxGeometry1, standardMaterial),
		box_r8: new Mesh(boxGeometry1, standardMaterial),
		box_r7: new Mesh(boxGeometry1, standardMaterial),
		box_r6: new Mesh(boxGeometry1, standardMaterial),
		box_r5: new Mesh(boxGeometry1, standardMaterial),
		box_r4: new Mesh(boxGeometry1, standardMaterial),
		box_r3: new Mesh(boxGeometry1, standardMaterial),
		box_r2: new Mesh(boxGeometry1, standardMaterial),
		box_r1: new Mesh(boxGeometry1, standardMaterial),
	}
	chunks_l = {
		box_l10: new Mesh(boxGeometry1, standardMaterial),
		box_l9: new Mesh(boxGeometry1, standardMaterial),
		box_l8: new Mesh(boxGeometry1, standardMaterial),
		box_l7: new Mesh(boxGeometry1, standardMaterial),
		box_l6: new Mesh(boxGeometry1, standardMaterial),
		box_l5: new Mesh(boxGeometry1, standardMaterial),
		box_l4: new Mesh(boxGeometry1, standardMaterial),
		box_l3: new Mesh(boxGeometry1, standardMaterial),
		box_l2: new Mesh(boxGeometry1, standardMaterial),
		box_l1: new Mesh(boxGeometry1, standardMaterial),
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
}

// Adding fancy corners
function prepareCorners(){
	cornerGeometry = new OctahedronGeometry(height * 0.7, 0);
	corner1 = new Mesh(cornerGeometry, standardMaterial);
	corner2 = new Mesh(cornerGeometry, standardMaterial);
	corner3 = new Mesh(cornerGeometry, standardMaterial);
	corner4 = new Mesh(cornerGeometry, standardMaterial);
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
}

// Adding paddles
function preparePaddles(){
	paddleLeftGeometry = new BoxGeometry(paddleWidth, paddleLength, height);
	paddleRightGeometry = new BoxGeometry(paddleWidth, paddleLength, height);
	paddleMaterial = new MeshStandardMaterial({color: color.paddles});
	paddleLeft = new Mesh(paddleLeftGeometry, paddleMaterial);
	paddleRight = new Mesh(paddleRightGeometry, paddleMaterial);
	paddleRight.position.set(halfFieldWidth - paddleWallDist, 0, height / 2);
	paddleLeft.position.set(-halfFieldWidth + paddleWallDist, 0, height / 2);
	paddleLeft.castShadow = true;
	paddleRight.castShadow = true;
	paddleLeft.receiveShadow = true;
	paddleRight.receiveShadow = true;
	scene.add(paddleLeft);
	scene.add(paddleRight);
}

// Adding ball
function prepareBall(){
	sphereGeometry = new SphereGeometry(ballRadius);
	sphereMaterial = new MeshStandardMaterial({color: color.ball});
	sphere = new Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	sphere.position.set(0, 0, ballRadius);
};

function initializeObjs(){
	prepareBasics();
	preparePlane();
	prepareLights();
	prepareField();
	prepareCorners();
	preparePaddles();
	prepareBall();
}

// Adding picture tablets
function createTexturedMeshes() {
	imgLoader = new TextureLoader();

	// Create promises for the texture loading and mesh creation
	meshPromises = [
		new Promise((resolve, reject) => {
			imgLoader.load(img1, function(texture) {
				let geometry = new PlaneGeometry(tabletSize, tabletSize);
				let material = new MeshBasicMaterial({map: texture});
				let mesh = new Mesh(geometry, material);
				resolve(mesh);
			}, undefined, reject);
		}),
		new Promise((resolve, reject) => {
			imgLoader.load(img2, function(texture) {
				let geometry = new PlaneGeometry(tabletSize, tabletSize);
				let material = new MeshBasicMaterial({map: texture});
				let mesh = new Mesh(geometry, material);
				resolve(mesh);
			}, undefined, reject);
		})
	];

	// Return a promise that resolves when all the meshes are created
	return Promise.all(meshPromises);
};

function placeLoadedAvatars(){
		scene.add(pic1);
		scene.add(pic2);
		pic1.position.set(-halfFieldWidth - tabletSize, halfFieldHeight - tabletSize / 2, 0);
		pic2.position.set(halfFieldWidth + tabletSize, halfFieldHeight - tabletSize / 2, 0);
}

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
	let speed = ballSpeed * ballHitSpeed * multiplier * (1 + multiplier);
	speed = speed > maxSpeed ? maxSpeed : speed;
	speed = speed < minSpeed ? minSpeed : speed;
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
	bounceCount[side]++;
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
					paddleSpeed = 0;
					start = false;
					updateInterval();
					finishGame();
					return;
				}
				scores[0]++;
				scene.remove(scoreboard[0]);
				scoreboard[0] = getScore(scores[0]);
				scoreDisplay();
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
					paddleSpeed = 0;
					start = false;
					updateInterval();
					finishGame();
					return;
				}
				scores[1]++;
				scene.remove(scoreboard[1]);
				scoreboard[1] = getScore(scores[1]);
				scoreDisplay();
				break;
			}
		}
		ballStart();
	}
	else if ((sphere.position.y + ballRadius >= halfFieldHeight
		&& sphere.position.y + ballRadius <= halfFieldHeight + height / 2)
		|| (sphere.position.y - ballRadius <= -halfFieldHeight
		&& sphere.position.y - ballRadius >= -halfFieldHeight - height / 2)){
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
		else
			ready = true;
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
	ticks =  Math.round(delta * 120);
	if (!lightsOn)
		lights(delta);
	else
		adjustLights(delta);
	if (camera.position.z != defaultCameraZ && camera.position.y != defaultCameraY)
	animateCamera();
	cameraMotion();
	for (let i = 0; i < ticks ; i++)
		updateGameLogic(delta / ticks);
	cpuPlayers(cpu[0], cpu[1]);
	// The render method links the camera and the scene
	renderer.render(scene, camera);
}

// COMMENT
// For dat.gui controls
// let gui = new GUI();

// let options = {
// 	ballMaxAngle: 60,
// 	paddleSpeed: 1.5,
// 	maxSpeed: 30,
// 	minSpeed: 20,
// 	ballHitSpeed: 1.5,
// 	ballInitialSpeed: 10,
// 	camOrbit: 20,
// 	camOrbitSpeed: 0,
// 	aiError: 1
// };

// gui.add(options, 'ballMaxAngle').min(30).max(90).step(1).onChange(function(value) {
// 	ballMaxAngle = value * Math.PI / 180;
// });

// gui.add(options, 'paddleSpeed').min(1).max(3).step(0.1).onChange(function(value) {
// 	paddleSpeed = value;
// });

// gui.add(options, 'maxSpeed').min(20).max(50).step(1).onChange(function(value) {
// 	maxSpeed = value;
// });

// gui.add(options, 'minSpeed').min(5).max(30).step(1).onChange(function(value) {
// 	minSpeed = value;
// });

// gui.add(options, 'ballHitSpeed').min(1).max(2).step(0.1).onChange(function(value) {
// 	ballHitSpeed = value;
// });

// gui.add(options, 'ballInitialSpeed').min(1).max(50).step(1).onChange(function(value) {
// 	ballInitialSpeed = value;
// });

// gui.add(options, 'camOrbit').min(0).max(100).step(1).onChange(function(value) {
// 	camOrbit = value;
// });

// gui.add(options, 'camOrbitSpeed').min(0.0).max(0.1).step(0.01).onChange(function(value) {
// 	camOrbitSpeed = value;
// });

// gui.add(options, 'aiError').min(0.1).max(2.0).step(0.1).onChange(function(value) {
// 	aiError = value;
// });

function cameraMotion(){
	if (!start)
		return;
	camTime += camOrbitSpeed;
	camera.position.x = Math.sin(camTime) * camOrbit;
	camera.position.y =  Math.sin(camTime) * Math.cos(camTime) * camOrbit;
	camera.lookAt(0, 0, 0);
}

function onKeyDown(e) {
	if (e.key in keys) {
		keys[e.key] = true;
	}
}

function onKeyUp(e) {
	if (e.key in keys) {
		keys[e.key] = false;
	}
}

function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onSpacePress(e) {
	if (e.code === 'Space' && !startCam && ready) {
		startCam = true;
		scene.remove(text4);
	}
	else if (e.code === 'Space' && startCam && Math.floor(camera.position.z) == defaultCameraZ && Math.floor(camera.position.y) == defaultCameraY) {
		scene.remove(text1);
		scene.remove(text2);
		scene.remove(text3);
		start = true;
		updateInterval();
	}
}

function onSkipAnimation(e) {
	if (!start && e.code === 'KeyY'){
		camera.position.set(0, defaultCameraY, defaultCameraZ);
		camera.lookAt(0, 0, 0);
		scene.remove(spotlight1);
		scene.remove(text4);
		directionalLight.intensity = 1;
		ambientLight.intensity = 1;
		lightsOn = true;
		startCam = true;
		startCam = true;
	}
}

function readyEventListeners() {
	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);
	window.addEventListener('resize', onResize);
	window.addEventListener('keydown', onSpacePress);
	window.addEventListener('keydown', onSkipAnimation);
}

function removeEventListeners() {
	window.removeEventListener('keydown', onKeyDown);
	window.removeEventListener('keyup', onKeyUp);
	window.removeEventListener('resize', onResize);
	window.removeEventListener('keydown', onSpacePress);
	window.removeEventListener('keydown', onSkipAnimation);
}

function textDisplay(){
	loader = new FontLoader();
	loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', function(font){
		let textGeometry1 = new TextGeometry('Press space to start', {
			font: font,
			size: 2,
			height: 0.5,
		});
		let textGeometry2 = new TextGeometry('W\n\n\n\nS', {
			font: font,
			size: 1,
			height: 0.5,
		});
		let textGeometry3 = new TextGeometry('   Up arrow\n\n\n\nDown arrow', {
			font: font,
			size: 1,
			height: 0.5,
		});
		let textGeometry4 = new TextGeometry('press space', {
			font: font,
			size: 1,
			height: 0.5,
		});
		let textMaterial = new MeshStandardMaterial({color: color.text});
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

function scoreDisplay(){
	scoreboard[0].position.set(-halfFieldWidth - tabletSize, -tabletSize, 0);
	scoreboard[1].position.set(halfFieldWidth + tabletSize, -tabletSize, 0);
	for (let i = 0; i < 2; i++)
		scene.add(scoreboard[i]);
}

// Get ball position once per second
function getBallPosition(){
	oldBallPosX = sphere.position.x;
	oldBallPosY = sphere.position.y;
}

function updateInterval() {
	if (start) {
		interval = setInterval(getBallPosition, 1000);
	} else if (interval) {
		clearInterval(interval);
	}
}

function checkDirection(){
	dX = sphere.position.x - oldBallPosX;
	dY = sphere.position.y - oldBallPosY;
}

function calcIntersect(side){
	let m = dY / dX;
	let b = sphere.position.y - m * sphere.position.x;
	let x = side ? paddleTotalDist : -paddleTotalDist;
	return m * x + b;
}

function cpuMove(player, intersect){
	switch(player){
		case 0:
			if (paddleLeft.position.y < intersect + aiError && paddleLeft.position.y > intersect - aiError){
				keys.s = false;
				keys.w = false;
			}
			else if (paddleLeft.position.y < intersect){
				keys.w = true;
				keys.s = false;
			}
			else if (paddleLeft.position.y > intersect){
				keys.s = true;
				keys.w = false;
			}
			break;
		case 1:
			if (paddleRight.position.y < intersect + aiError && paddleRight.position.y > intersect - aiError){
				keys.ArrowDown = false;
				keys.ArrowUp = false;
			}
			else if (paddleRight.position.y < intersect){
				keys.ArrowUp = true;
				keys.ArrowDown = false;
			}
			else if (paddleRight.position.y > intersect){
				keys.ArrowDown = true;
				keys.ArrowUp = false;
			}
			break;
	}
}

function cpuPlayers(left, right){
	checkDirection();
	if (left){
		if (dX > 0)
			cpuMove(0, 0);
		else
			cpuMove(0, calcIntersect(0));
	}
	if (right){
		if (dX < 0)
			cpuMove(1, 0);
		else
			cpuMove(1, calcIntersect(1));
	}
}

function sendData(){
	let results = [scores[0], scores[1]];
	const data = {
		results: results,
		bounces: bounceCount,
		time: matchTime
	};
	localStorage.setItem('pongData', JSON.stringify(data));
}

function disposeObject(obj) {
	if (obj) {
		if (obj.geometry) {
			obj.geometry.dispose();
		}
		if (obj.material) {
			obj.material.dispose();
		}
		scene.remove(obj);
	}
}

function finishGame(){
	// Stop match clock
	clearInterval(timer);
	// Deep cleaning, nothing left behind
	renderer.setAnimationLoop(null);
	disposeObject(plane);
	disposeObject(ambientLight);
	disposeObject(directionalLight);
	disposeObject(spotlight1);
	Object.values(chunks_r).forEach(disposeObject);
	Object.values(chunks_l).forEach(disposeObject);
	disposeObject(box_t);
	disposeObject(box_b);
	disposeObject(corner1);
	disposeObject(corner2);
	disposeObject(corner3);
	disposeObject(corner4);
	disposeObject(paddleLeft);
	disposeObject(paddleRight);
	disposeObject(sphere);
	disposeObject(pic1);
	disposeObject(pic2);
	disposeObject(text1);
	disposeObject(text2);
	disposeObject(text3);
	disposeObject(text4);
	Object.values(scoreboard).forEach(disposeObject);
	imgLoader = null;
	meshPromises = null;
	removeEventListeners();
	camera = null;
	scene = null;
	renderer.dispose();
	document.getElementById('pong').style.display = 'none';
	sendData();
	matchTime = 0;
	bounceCount = [0, 0];
}

function prepVars(){
	clock = new Clock();
	delta = 0;
	ticks = 0;
	lightsOn = false;
	ready = false;
	startCam = false;
	start = false;
	scores = [0, 0];
	scoreboard = [0, 0];
	bounceCount = [0, 0];
	cpu = [0, 0];
	timer = null;
	matchTime = 0;
}


async function main(){
	prepVars();
	initializeObjs();
	readyEventListeners();
	await createTexturedMeshes().then(([mesh1, mesh2]) => {
		// The avatar meshes are ready
		pic1 = mesh1;
		pic2 = mesh2;
		placeLoadedAvatars();
		ballStart();
		textDisplay();
	}).catch(error => {
		// An error occurred while loading the textures or creating the meshes
		console.error('An error occurred:', error);
	});
	await loadScoreMeshes().then(() => {
		scoreboard = [getScore(scores[0]), getScore(scores[0])];
		scoreDisplay();
	}).catch(error => {
		console.error('An error occurred while loading the score meshes:', error);
	});
	timer = setInterval(() => {
		matchTime++;
	}, 1000);
	renderer.setAnimationLoop(animate);
}

document.addEventListener('DOMContentLoaded', function() {
	const buttons = document.querySelectorAll('.play-menu-button');
	const game_1v1_button = buttons[0];
	const game_1vAI_button = buttons[1];
	game_1v1_button.addEventListener('click', startGame);
	function startGame() {
		cpu = [0, 0];
		document.getElementById('pong').style.display = 'block';
		main();
	}
	game_1vAI_button.addEventListener('click', startGameNoAI);
	function startGameNoAI() {
		cpu = [0, 1];
		document.getElementById('pong').style.display = 'block';
		main();
	}
});
