import * as vars from './variables.js';

export function createBall(){
	const sphereGeometry = new THREE.SphereGeometry(vars.ballRadius);
	const sphereMaterial = new THREE.MeshStandardMaterial({color: vars.sphereColor});
	vars.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	vars.scene.add(vars.sphere);
	vars.sphere.castShadow = true;
	vars.sphere.receiveShadow = true;
	vars.sphere.position.set(0, 0, vars.ballRadius);
}
