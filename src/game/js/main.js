import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as vars from './variables.js';
import {createField} from './field.js';
import {createBall} from './ball.js';
import {createPaddles} from './paddles.js';
import {setGUI} from './gui.js';

function init(){
	// Create renderer instance with antialias
	vars.renderer = new THREE.WebGLRenderer({antialias: true});

	// Enable shadows
	vars.renderer.shadowMap.enabled = true;

	// Change the background color
	vars.renderer.setClearColor(0x333333);

	// Define the size of the renderer
	vars.renderer.setSize(window.innerWidth, window.innerHeight);

	// Inject canvas element into the page
	document.body.appendChild(vars.renderer.domElement);

	// Add background
	vars.scene = new THREE.Scene();

	// Add camera
	vars.camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	// Change camera position along the x, y ands z axes
	vars.camera.position.set(0, 10, 60);

	// Instantiate the orbit control class with the camera
	// COMMENT
	const orbit = new OrbitControls(vars.camera, vars.renderer.domElement);

	// Whenever the camera position is changed, orbit MUST update
	// COMMENT
	orbit.update();

	// Simple coordinate guide
	// COMMENT
	const axesHelper = new THREE.AxesHelper(5);
	vars.scene.add(axesHelper);
	createField();
	createPaddles();
	createBall();
	setGUI();
}

function prepareLogic(){
	// Listen for key press
	window.addEventListener('keydown', function(e) {
		if (e.key in vars.keys) {
			vars.keys[e.key] = true;
		}
	});

	// Listen for key release
	window.addEventListener('keyup', function(e) {
		if (e.key in vars.keys) {
			vars.keys[e.key] = false;
		}
	});
	// Make the canvas responsive (change size automatically)
	window.addEventListener('resize', function() {
		vars.camera.aspect = window.innerWidth / window.innerHeight;
		vars.camera.updateProjectionMatrix();
		vars.renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

function move(){
	if (vars.keys.ArrowUp && !vars.keys.ArrowDown && vars.paddleRight.position.y < vars.halfFieldHeight - vars.halfPaddleLength - vars.lerpStep) {
		vars.paddleRight.position.lerp(new THREE.Vector3(vars.paddleRight.position.x, vars.paddleRight.position.y + vars.lerpStep, vars.paddleRight.position.z), vars.paddleSpeed);
	}
	if (vars.keys.ArrowDown && !vars.keys.ArrowUp && vars.paddleRight.position.y > -halfFieldHeight + vars.halfPaddleLength + vars.lerpStep) {
		vars.paddleRight.position.lerp(new THREE.Vector3(vars.paddleRight.position.x, vars.paddleRight.position.y - vars.lerpStep, vars.paddleRight.position.z), vars.paddleSpeed);
	}
	if (vars.keys.w && !vars.keys.s && vars.paddleLeft.position.y < vars.halfFieldHeight - vars.halfPaddleLength - vars.lerpStep) {
		vars.paddleLeft.position.lerp(new THREE.Vector3(vars.paddleLeft.position.x, vars.paddleLeft.position.y + vars.lerpStep, vars.paddleLeft.position.z), vars.paddleSpeed);
	}
	if (vars.keys.s && !vars.keys.w && vars.paddleLeft.position.y > -halfFieldHeight + vars.halfPaddleLength + vars.lerpStep) {
		vars.paddleLeft.position.lerp(new THREE.Vector3(vars.paddleLeft.position.x, vars.paddleLeft.position.y - vars.lerpStep, vars.paddleLeft.position.z), vars.paddleSpeed);
	}
}

// Defines ball direction at the beginning and resets
function ballStart(){
	vars.sphere.position.set(0, 0, vars.ballRadius);
	vars.ballSpeed = vars.ballInitialSpeed;
	// Direction in radians to later decompose in x and y
	let rand = THREE.MathUtils.randFloatSpread(2.0 * vars.ballMaxAngle);
	let rand2 = Math.random();
	vars.ballDirection = rand2 >= 0.5 ? rand : rand + Math.PI;
}

function checkAlignment(paddle){
	return vars.sphere.position.y - vars.ballRadius < vars.paddle.position.y + vars.halfPaddleLength && vars.sphere.position.y + vars.ballRadius > vars.paddle.position.y - vars.halfPaddleLength;
}

function paddleLeftCollision(){
	return vars.sphere.position.x - vars.ballRadius < -vars.paddleTotalDist && vars.sphere.position.x - vars.ballRadius > -vars.paddleTotalDist - vars.paddleWidth;
}

function paddleRightCollision(){
	return vars.sphere.position.x + vars.ballRadius > vars.paddleTotalDist && vars.sphere.position.x + vars.ballRadius < vars.paddleTotalDist + vars.paddleWidth;
}

function bounceSpeed(multiplier){
	let speed = vars.ballSpeed * vars.ballHitSpeed * (1 + multiplier);
	speed = speed > vars.maxSpeed ? vars.maxSpeed : speed;
	return speed;
}

function bounce(side, paddle){
	// The multiplier will act as a percentage.
	// The further the ball hits from the center of the paddle, the higher the multiplier
	let multiplier = Math.abs((vars.sphere.position.y - vars.paddle.position.y) / vars.halfPaddleLength);
	vars.ballSpeed = bounceSpeed(multiplier);
	vars.ballDirection = (vars.sphere.position.y - vars.paddle.position.y) / (vars.halfPaddleLength + vars.ballRadius) * vars.ballMaxAngle;
	if (side)
		vars.ballDirection = Math.PI - vars.ballDirection;
}

function collision() {
	if (checkAlignment(vars.paddleLeft) && paddleLeftCollision()){
		bounce(0, vars.paddleLeft);
	}
	else if (checkAlignment(vars.paddleRight) && paddleRightCollision()){
		bounce(1, vars.paddleRight);
	}
	else if (vars.sphere.position.x + vars.ballRadius >= vars.halfFieldWidth){
		for (let boxNumber in vars.chunks_l){
			if (vars.chunks_l[boxNumber].material === vars.standardMaterial){
				vars.chunks_l[boxNumber].material = vars.scoreboardMaterial;
				// If it's the last chunk, the game ends
				// MISSING LOGIC
				break;
			}
		}
		ballStart();
	}
	else if (vars.sphere.position.x - vars.ballRadius <= -vars.halfFieldWidth){
		for (let boxNumber in vars.chunks_r){
			if (vars.chunks_r[boxNumber].material === vars.standardMaterial){
				vars.chunks_r[boxNumber].material = vars.scoreboardMaterial;
				// If it's the last chunk, the game ends
				// MISSING LOGIC
				break;
			}
		}
		ballStart();
	}
	else if (vars.sphere.position.y + vars.ballRadius >= vars.halfFieldHeight
		|| vars.sphere.position.y - vars.ballRadius <= -vars.halfFieldHeight){
		vars.ballDirection = -vars.ballDirection;
	}
}

function updateBallPosition(delta){
	const distance = vars.ballSpeed * delta;
	const increment = new THREE.Vector3(distance * Math.cos(ballDirection), distance * Math.sin(ballDirection), 0);
	vars.sphere.position.add(increment);
}

function updateGameLogic(delta){
	move();
	updateBallPosition(delta);
	collision();
}

function animate() {
	// Updates game movement and collisions twice per frame
	// Simulating 120 tick server
	vars.delta = vars.clock.getDelta();
	vars.ticks = Math.round(vars.delta * 120);
	updateGameLogic(vars.delta);
	
	// THIS MESSES WITH THE INITIAL BALL POSITION
	// for (let i = 0; i < ticks; i++){
	// 	updateGameLogic(delta);
	// };
	// The render method links the camera and the scene
	vars.renderer.render(vars.scene, vars.camera);
}

// Start the clock
vars.clock.start();
ballStart();
// Pass the animate function to the renderer so it displays motion
vars.renderer.setAnimationLoop(animate);

function main(){
	init();
	prepareLogic();
}