let paddleLength = 2;
let paddleWidth = 0.4;
let paddleWallDist = 2;
let paddleColor = 0xFFFF00;

export function createPaddles(){
	const paddleLeftGeometry = new THREE.BoxGeometry(paddleWidth, paddleLength, height);
	const paddleRightGeometry = new THREE.BoxGeometry(paddleWidth, paddleLength, height);
	const paddleMaterial = new THREE.MeshStandardMaterial({color: paddleColor});
	const paddleLeft = new THREE.Mesh(paddleLeftGeometry, paddleMaterial);
	const paddleRight = new THREE.Mesh(paddleRightGeometry, paddleMaterial);
	paddleRight.position.set(halfFieldWidth - paddleWallDist, 0, height / 2);
	paddleLeft.position.set(-halfFieldWidth + paddleWallDist, 0, height / 2);
	paddleLeft.castShadow = true;
	paddleRight.castShadow = true;
	paddleLeft.receiveShadow = true;
	paddleRight.receiveShadow = true;
	scene.add(paddleLeft);
	scene.add(paddleRight);
}