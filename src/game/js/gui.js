import * as dat from 'dat.gui';

const options = {
	ballMaxAngle: 60,
	paddleSpeed: 2,
	maxSpeed: 30,
	minSpeed: 10,
	ballHitSpeed: 1.5,
	ballInitialSpeed: 15
};

// For dat.gui controls
const gui = new dat.GUI();

export function setGUI(){
	gui.add(options, 'ballMaxAngle').min(0).max(90).step(1).onChange(function(value) {
		ballMaxAngle = value * Math.PI / 180;
	});
	
	gui.add(options, 'paddleSpeed').min(0).max(10).step(0.1).onChange(function(value) {
		paddleSpeed = value;
	});
	
	gui.add(options, 'maxSpeed').min(0).max(100).step(1).onChange(function(value) {
		maxSpeed = value;
	});
	
	gui.add(options, 'minSpeed').min(0).max(100).step(1).onChange(function(value) {
		minSpeed = value;
	});
	
	gui.add(options, 'ballHitSpeed').min(0).max(10).step(0.1).onChange(function(value) {
		ballHitSpeed = value;
	});
	
	gui.add(options, 'ballInitialSpeed').min(0).max(100).step(1).onChange(function(value) {
		ballInitialSpeed = value;
	});
}
