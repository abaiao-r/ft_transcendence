import * as vars from './variables.js';

function initPlane(){
	// Add plane
	const planeGeometry = new THREE.PlaneGeometry(vars.fieldWidth, vars.fieldHeight);
	const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	vars.scene.add(plane);

	// Plane receives shadows
	plane.receiveShadow = true;

	// Adding ambient light
	const ambientLight = new THREE.AmbientLight(0x666666);
	vars.scene.add(ambientLight);

	// Directional light
	const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
	vars.scene.add(directionalLight);
	directionalLight.position.set(0, -30, 50);
	// Light must cast shadows, otherwise the rest of the shadow configurations won't work
	directionalLight.castShadow = true;
	// Increasing the size of the the shadow camera
	directionalLight.shadow.camera.top = vars.halfFieldHeight;
	directionalLight.shadow.camera.bottom = -vars.halfFieldHeight;
	directionalLight.shadow.camera.right = vars.halfFieldWidth + vars.height;
	directionalLight.shadow.camera.left = -vars.halfFieldWidth - vars.height;

	// Add directional light helper to visualize source
	// Second argument defines the size
	const dLIghtHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
	vars.scene.add(dLIghtHelper);

	// Add helper for the shadow camera
	const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
	vars.scene.add(dLightShadowHelper);
}

function createOutline(){
	// Standard material for reuse
	vars.standardMaterial = new THREE.MeshStandardMaterial({color: vars.baseColor});
	vars.scoreboardMaterial = new THREE.MeshStandardMaterial({color: vars.pointColor});

	// Adding boxes for edges
	// const boxGeometry1 = new THREE.BoxGeometry(height, fieldHeight + height * 2, height);
	const boxGeometry1 = new THREE.BoxGeometry(vars.height, vars.chunkSize, vars.height);
	const boxGeometry2 = new THREE.BoxGeometry(vars.fieldWidth + vars.height * 2, vars.height, vars.height);
	vars.box_t = new THREE.Mesh(boxGeometry2, vars.standardMaterial);
	vars.box_b = new THREE.Mesh(boxGeometry2, vars.standardMaterial);
	// 10 chunks of sides to later behave as the scoreboard
	vars.chunks_r = {
		box_r10 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_r9 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_r8 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_r7 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_r6 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_r5 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_r4 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_r3 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_r2 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_r1 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
	}
	vars.chunks_l = {
		box_l10 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_l9 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_l8 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_l7 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_l6 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_l5 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_l4 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_l3 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_l2 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
		box_l1 : new THREE.Mesh(boxGeometry1, vars.standardMaterial),
	}

	for (let boxNumber in vars.chunks_r){
		scene.add(vars.chunks_r[boxNumber]);
		vars.chunks_r[boxNumber].castShadow = true;
		vars.chunks_r[boxNumber].receiveShadow = true;
	}

	for (let boxNumber in vars.chunks_l){
		scene.add(vars.chunks_l[boxNumber]);
		vars.chunks_l[boxNumber].castShadow = true;
		vars.chunks_l[boxNumber].receiveShadow = true;
	}

	for (let i = 1; i <= 10; i++){
		vars.chunks_r[`box_r${i}`].position.set(vars.halfFieldWidth + vars.height / 2, vars.halfFieldHeight - (2 * i - 1) * vars.chunkSize / 2, vars.height / 2);
		vars.chunks_l[`box_l${i}`].position.set(-vars.halfFieldWidth - vars.height / 2, vars.halfFieldHeight - (2 * i - 1) * vars.chunkSize / 2, vars.height / 2);
	}

	vars.scene.add(vars.box_t);
	vars.scene.add(vars.box_b);
	vars.box_t.position.set(0, vars.halfFieldHeight + vars.height / 2, vars.height / 2);
	vars.box_b.position.set(0, -vars.halfFieldHeight - vars.height / 2, vars.height / 2);
	vars.box_t.castShadow = true;
	vars.box_b.castShadow = true;
	vars.box_t.receiveShadow = true;
	vars.box_b.receiveShadow = true;

	// Adding fancy corners
	const cornerGeometry = new THREE.OctahedronGeometry(vars.height * 0.7, 0);
	const corner1 = new THREE.Mesh(cornerGeometry, vars.standardMaterial);
	const corner2 = new THREE.Mesh(cornerGeometry, vars.standardMaterial);
	const corner3 = new THREE.Mesh(cornerGeometry, vars.standardMaterial);
	const corner4 = new THREE.Mesh(cornerGeometry, vars.standardMaterial);
	vars.scene.add(corner1);
	vars.scene.add(corner2);
	vars.scene.add(corner3);
	vars.scene.add(corner4);
	corner1.rotateZ(Math.PI / 4);
	corner2.rotateZ(Math.PI / 4);
	corner3.rotateZ(Math.PI / 4);
	corner4.rotateZ(Math.PI / 4);
	corner1.position.set(-vars.halfFieldWidth - vars.height / 2, vars.halfFieldHeight + vars.height / 2, vars.height);
	corner2.position.set(vars.halfFieldWidth + vars.height / 2, vars.halfFieldHeight + vars.height / 2, vars.height);
	corner3.position.set(-vars.halfFieldWidth - vars.height / 2, -vars.halfFieldHeight - vars.height / 2, vars.height);
	corner4.position.set(vars.halfFieldWidth + vars.height / 2, -vars.halfFieldHeight - vars.height / 2, vars.height);
	corner1.castShadow = true;
	corner2.castShadow = true;
	corner3.castShadow = true;
	corner4.castShadow = true;
	corner1.receiveShadow = true;
	corner2.receiveShadow = true;
	corner3.receiveShadow = true;
	corner4.receiveShadow = true;
}

export function createField(){
	initPlane();
	createOutline();
}
