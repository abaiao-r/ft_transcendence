let fieldWidth = 40;
let halfFieldWidth = fieldWidth / 2;
let fieldHeight = 30;
let halfFieldHeight = fieldHeight / 2;
let height = 1;
let chunkSize = fieldHeight / 10;
let baseColor = 0xFF0000;

function initPlane(){
	// Add plane
	const planeGeometry = new THREE.PlaneGeometry(fieldWidth, fieldHeight);
	const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(plane);

	// Plane receives shadows
	plane.receiveShadow = true;

	// Adding ambient light
	const ambientLight = new THREE.AmbientLight(0x666666);
	scene.add(ambientLight);

	// Directional light
	const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
	scene.add(directionalLight);
	directionalLight.position.set(0, -30, 50);
	// Light must cast shadows, otherwise the rest of the shadow configurations won't work
	directionalLight.castShadow = true;
	// Increasing the size of the the shadow camera
	directionalLight.shadow.camera.top = halfFieldHeight;
	directionalLight.shadow.camera.bottom = -halfFieldHeight;
	directionalLight.shadow.camera.right = halfFieldWidth + height;
	directionalLight.shadow.camera.left = -halfFieldWidth - height;

	// Add directional light helper to visualize source
	// Second argument defines the size
	const dLIghtHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
	scene.add(dLIghtHelper);

	// Add helper for the shadow camera
	const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
	scene.add(dLightShadowHelper);
}

function createOutline(){
	// Standard material for reuse
	const standardMaterial = new THREE.MeshStandardMaterial({color: baseColor});
	const scoreboardMaterial = new THREE.MeshStandardMaterial({color: pointColor});

	// Adding boxes for edges
	// const boxGeometry1 = new THREE.BoxGeometry(height, fieldHeight + height * 2, height);
	const boxGeometry1 = new THREE.BoxGeometry(height, chunkSize, height);
	const boxGeometry2 = new THREE.BoxGeometry(fieldWidth + height * 2, height, height);
	const box_t = new THREE.Mesh(boxGeometry2, standardMaterial);
	const box_b = new THREE.Mesh(boxGeometry2, standardMaterial);
	// 10 chunks of sides to later behave as the scoreboard
	const chunks_r = {
		box_r10 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_r9 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_r8 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_r7 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_r6 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_r5 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_r4 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_r3 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_r2 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_r1 : new THREE.Mesh(boxGeometry1, standardMaterial),
	}
	const chunks_l = {
		box_l10 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_l9 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_l8 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_l7 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_l6 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_l5 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_l4 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_l3 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_l2 : new THREE.Mesh(boxGeometry1, standardMaterial),
		box_l1 : new THREE.Mesh(boxGeometry1, standardMaterial),
	}

	for (let boxNumber in chunks_r){
		scene.add(chunks_r[boxNumber]);
		chunks_r[boxNumber].castShadow = true;
		chunks_r[boxNumber].receiveShadow = true;
	}

	for (let boxNumber in chunks_l){
		scene.add(chunks_l[boxNumber]);
		chunks_l[boxNumber].castShadow = true;
		chunks_l[boxNumber].receiveShadow = true;
	}

	for (let i = 1; i <= 10; i++){
		chunks_r[`box_r${i}`].position.set(halfFieldWidth + height / 2, halfFieldHeight - (2 * i - 1) * chunkSize / 2, height / 2);
		chunks_l[`box_l${i}`].position.set(-halfFieldWidth - height / 2, halfFieldHeight - (2 * i - 1) * chunkSize / 2, height / 2);
	}

	scene.add(box_t);
	scene.add(box_b);
	box_t.position.set(0, halfFieldHeight + height / 2, height / 2);
	box_b.position.set(0, -halfFieldHeight - height / 2, height / 2);
	box_t.castShadow = true;
	box_b.castShadow = true;
	box_t.receiveShadow = true;
	box_b.receiveShadow = true;

	// Adding fancy corners
	const cornerGeometry = new THREE.OctahedronGeometry(height * 0.7, 0);
	const corner1 = new THREE.Mesh(cornerGeometry, standardMaterial);
	const corner2 = new THREE.Mesh(cornerGeometry, standardMaterial);
	const corner3 = new THREE.Mesh(cornerGeometry, standardMaterial);
	const corner4 = new THREE.Mesh(cornerGeometry, standardMaterial);
	scene.add(corner1);
	scene.add(corner2);
	scene.add(corner3);
	scene.add(corner4);
	corner1.rotateZ(Math.PI / 4);
	corner2.rotateZ(Math.PI / 4);
	corner3.rotateZ(Math.PI / 4);
	corner4.rotateZ(Math.PI / 4);
	corner1.position.set(-halfFieldWidth - height / 2, halfFieldHeight + height / 2, height);
	corner2.position.set(halfFieldWidth + height / 2, halfFieldHeight + height / 2, height);
	corner3.position.set(-halfFieldWidth - height / 2, -halfFieldHeight - height / 2, height);
	corner4.position.set(halfFieldWidth + height / 2, -halfFieldHeight - height / 2, height);
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
