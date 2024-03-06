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
let paddleSpeed = 2;
let maxSpeed = 30;
let ballHitSpeed = 1.5;
let ballInitialSpeed = ballHitSpeed * 15;
let baseColor = 0xFF0000;
let pointColor = 0x00FF00;
let sphereColor = 0x0000FF;
let paddleColor = 0xFFFF00;

// DON'T TOUCH
let ballSpeed = 0;
let paddleTotalDist = halfFieldWidth - paddleWallDist - paddleWidth / 2;
let lerpStep = 0.1;
let ballDirection = 0;
let delta = 0;
let ticks = 0;
var clock;

// Key states
let keys = {
	ArrowUp: false,
	ArrowDown: false,
	w: false,
	s: false
};

var renderer;
var scene;
var camera;
var planeGeometry;
var planeMaterial;
var standardMaterial;
var scoreboardMaterial;
var box_t;
var box_b;
var chunks_r;
var chunks_l;
var paddleRight;
var paddleLeft;
var sphere;

var gui;
let options = {
	ballMaxAngle: 60,
	paddleSpeed: 2,
	maxSpeed: 30,
	minSpeed: 10,
	ballHitSpeed: 1.5,
	ballInitialSpeed: 15
};