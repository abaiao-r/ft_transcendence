let ballRadius = 0.3;
let ballMaxAngle = Math.PI / 3; // 60 degrees
let maxSpeed = 30;
let minSpeed = 10;
let ballSpeed = 0;
let ballHitSpeed = 1.5;
let ballInitialSpeed = ballHitSpeed * 15;
let sphereColor = 0x0000FF;
let ballDirection = 0;

export function createBall(){
	const sphereGeometry = new THREE.SphereGeometry(ballRadius);
	const sphereMaterial = new THREE.MeshStandardMaterial({color: sphereColor});
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	sphere.position.set(0, 0, ballRadius);
}
