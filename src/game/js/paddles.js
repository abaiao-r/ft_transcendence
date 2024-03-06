import * as vars from './variables.js';

export function createPaddles(){
	const paddleLeftGeometry = new THREE.BoxGeometry(vars.paddleWidth, vars.paddleLength, vars.height);
	const paddleRightGeometry = new THREE.BoxGeometry(vars.paddleWidth, vars.paddleLength, vars.height);
	const paddleMaterial = new THREE.MeshStandardMaterial({color: vars.paddleColor});
	vars.paddleLeft = new THREE.Mesh(paddleLeftGeometry, paddleMaterial);
	vars.paddleRight = new THREE.Mesh(paddleRightGeometry, paddleMaterial);
	vars.paddleRight.position.set(vars.halfFieldWidth - vars.paddleWallDist, 0, vars.height / 2);
	vars.paddleLeft.position.set(-vars.halfFieldWidth + vars.paddleWallDist, 0, vars.height / 2);
	vars.paddleLeft.castShadow = true;
	vars.paddleRight.castShadow = true;
	vars.paddleLeft.receiveShadow = true;
	vars.paddleRight.receiveShadow = true;
	vars.scene.add(vars.paddleLeft);
	vars.scene.add(vars.paddleRight);
}