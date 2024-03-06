import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {createField} from './field.js';
import {createBall} from './ball.js';
import {createPaddles} from './paddles.js';
import {setGUI} from './gui.js';

// Key states
let keys = {
	ArrowUp: false,
	ArrowDown: false,
	w: false,
	s: false
};

function init(){
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
	camera.position.set(0, 10, 60);

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
	createField();
	createPaddles();
	createBall();
	setGUI();
}

function prepareLogic(){
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
	// Make the canvas responsive (change size automatically)
	window.addEventListener('resize', function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

function move(){
	if (keys.ArrowUp && !keys.ArrowDown && paddleRight.position.y < halfFieldHeight - halfPaddleLength - lerpStep) {
		paddleRight.position.lerp(new THREE.Vector3(paddleRight.position.x, paddleRight.position.y + lerpStep, paddleRight.position.z), paddleSpeed);
	}
	if (keys.ArrowDown && !keys.ArrowUp && paddleRight.position.y > -halfFieldHeight + halfPaddleLength + lerpStep) {
		paddleRight.position.lerp(new THREE.Vector3(paddleRight.position.x, paddleRight.position.y - lerpStep, paddleRight.position.z), paddleSpeed);
	}
	if (keys.w && !keys.s && paddleLeft.position.y < halfFieldHeight - halfPaddleLength - lerpStep) {
		paddleLeft.position.lerp(new THREE.Vector3(paddleLeft.position.x, paddleLeft.position.y + lerpStep, paddleLeft.position.z), paddleSpeed);
	}
	if (keys.s && !keys.w && paddleLeft.position.y > -halfFieldHeight + halfPaddleLength + lerpStep) {
		paddleLeft.position.lerp(new THREE.Vector3(paddleLeft.position.x, paddleLeft.position.y - lerpStep, paddleLeft.position.z), paddleSpeed);
	}
}

// Defines ball direction at the beginning and resets
function ballStart(){
	sphere.position.set(0, 0, ballRadius);
	ballSpeed = ballInitialSpeed;
	// Direction in radians to later decompose in x and y
	let rand = THREE.MathUtils.randFloatSpread(2.0 * ballMaxAngle);
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
	// Is the minSpeed really necessary? 
	speed = speed < minSpeed ? minSpeed : speed;
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
				// If it's the last chunk, the game ends
				// MISSING LOGIC
				break;
			}
		}
		ballStart();
	}
	else if (sphere.position.x - ballRadius <= -halfFieldWidth){
		for (let boxNumber in chunks_r){
			if (chunks_r[boxNumber].material === standardMaterial){
				chunks_r[boxNumber].material = scoreboardMaterial;
				// If it's the last chunk, the game ends
				// MISSING LOGIC
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
	const distance = ballSpeed * delta;
	const increment = new THREE.Vector3(distance * Math.cos(ballDirection), distance * Math.sin(ballDirection), 0);
	sphere.position.add(increment);
}

function updateGameLogic(delta){
	move();
	updateBallPosition(delta);
	collision();
}

function animate() {
	// Updates game movement and collisions twice per frame
	// Simulating 120 tick server
	delta = clock.getDelta();
	ticks = Math.round(delta * 120);
	updateGameLogic(delta);
	
	// THIS MESSES WITH THE INITIAL BALL POSITION
	// for (let i = 0; i < ticks; i++){
	// 	updateGameLogic(delta);
	// };
	// The render method links the camera and the scene
	renderer.render(scene, camera);
}

// Start the clock
clock.start();
ballStart();
// Pass the animate function to the renderer so it displays motion
renderer.setAnimationLoop(animate);