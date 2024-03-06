import * as dat from 'dat.gui';
import * as vars from './variables.js';

// For dat.gui controls
vars.gui = new dat.GUI();

export function setGUI(){
	vars.gui.add(options, 'ballMaxAngle').min(0).max(90).step(1).onChange(function(value) {
		ballMaxAngle = value * Math.PI / 180;
	});
	
	vars.gui.add(options, 'paddleSpeed').min(0).max(10).step(0.1).onChange(function(value) {
		paddleSpeed = value;
	});
	
	vars.gui.add(options, 'maxSpeed').min(0).max(100).step(1).onChange(function(value) {
		maxSpeed = value;
	});
	
	vars.gui.add(options, 'minSpeed').min(0).max(100).step(1).onChange(function(value) {
		minSpeed = value;
	});
	
	vars.gui.add(options, 'ballHitSpeed').min(0).max(10).step(0.1).onChange(function(value) {
		ballHitSpeed = value;
	});
	
	vars.gui.add(options, 'ballInitialSpeed').min(0).max(100).step(1).onChange(function(value) {
		ballInitialSpeed = value;
	});
}
