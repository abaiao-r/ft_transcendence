// import * as THREE from 'three';
import {
    Clock,
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    CubeTextureLoader,
    AmbientLight,
    DirectionalLight,
    SpotLight,
    DirectionalLightHelper,
    CameraHelper,
    BoxGeometry,
    OctahedronGeometry,
    SphereGeometry,
    Vector2,
    Vector3,
    MathUtils,
    DoubleSide,
    MeshBasicMaterial
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import {
    getScore,
    loadScoreMeshes
} from './scores.js';
// import { GUI } from 'dat.gui';
import * as colors from './colors.js';

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
let paddleSpeed = 1.5;
let maxSpeed = 30;
let minSpeed = 20;
let ballHitSpeed = 1.5;
let ballInitialSpeed = ballHitSpeed * 8;
let defaultCameraZ = 50;
let defaultCameraY = 0;
let orbitRadius = 15;
let orbitAngle = Math.PI / 16;
let orbitY = orbitRadius * Math.cos(orbitAngle);
let tabletSize = 5;
let pic1;
let pic2;
let camTime = 0;
let camOrbit = 20;
let camOrbitSpeed = 0.0;
// DON'T TOUCH
let ballSpeed = 0;
let lastBounceTime;
const bounceCooldown = 50;
let paddleTotalDist = halfFieldWidth - paddleWallDist - paddleWidth / 2;
let lerpStep = 0.1;
let ballDirection = 0;
let currBallPosX = 0;
let currBallPosY = 0;
let aiVec;
let text1;
let text2;
let text3;
let text4;
let lightsOn;
let ready;
let startCam;
let start;
let clock;
let delta;
let ticks;
let interval;
// For testing specific palettes
let color = colors.gpt;
// let color = colors.selectRandomPalette();

let scores;
let scoreboard;
let names;
let nameLeft;
let nameRight;
let bounceCount;
let cpu;
let timer;
let matchTime;

// Basics
let renderer;
let scene;
let camera;
let planeGeometry;
let planeMaterial;
let plane;
let ambientLight;
let directionalLight;
let spotlight1;
let standardMaterial;
let scoreboardMaterial;
let boxGeometry1;
let boxGeometry2;
let box_t;
let box_b;
let chunks_r;
let chunks_l;
let cornerGeometry;
let corner1;
let corner2;
let corner3;
let corner4;
let paddleLeftGeometry;
let paddleRightGeometry;
let paddleMaterial;
let paddleLeft;
let paddleRight;
let sphereGeometry;
let sphereMaterial;
let sphere;
let imgLoader;
let meshPromises;
let loader;
let avatarsToLoad;
let img1;
let img2;
let gameData;
let p1Side;
let p2Side;
let p1Avatar;
let p2Avatar;
let updateAI;
let aiError;
let abort;
// let gui;

// Key states
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false
};

function prepareBasics() {
    // Create renderer instance with antialias
    renderer = new WebGLRenderer({ antialias: true });

    // Enable shadows
    renderer.shadowMap.enabled = true;

    // Change the background color
    renderer.setClearColor(color.background);

    // Define the size of the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Check for old canvas and remove it to start a new game by appending a new one
    let gameContainer = document.getElementById('pong');
    let oldGame = gameContainer.querySelector('.renderer');
    if (oldGame)
        gameContainer.removeChild(oldGame);
    gameContainer.appendChild(renderer.domElement);
    renderer.domElement.classList.add('renderer');

    // Use this instead of the above when running directly with parcel
    // Inject canvas element into the page
    // document.body.appendChild(renderer.domElement);

    // Add background
    scene = new Scene();

    // Add camera
    camera = new PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Change camera position along the x, y ands z axes
    camera.position.set(0, -10, 1);
    camera.lookAt(0, 0, 0);

    // Instantiate the orbit control class with the camera
    // COMMENT
    // let orbit = new OrbitControls(camera, renderer.domElement);

    // Whenever the camera position is changed, orbit MUST update
    // COMMENT
    // orbit.update();

    // Simple coordinate guide
    // COMMENT
    // let axesHelper = new AxesHelper(5);
    // scene.add(axesHelper);
}

function preparePlane() {
    // Add plane
    planeGeometry = new PlaneGeometry(fieldWidth, fieldHeight);
    planeMaterial = new MeshStandardMaterial({ color: color.field, side: DoubleSide });
    plane = new Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    // Plane receives shadows
    plane.receiveShadow = true;
}

function prepareLights() {
    // Adding ambient light
    ambientLight = new AmbientLight(0x666666);
    ambientLight.intensity = 0;
    scene.add(ambientLight);

    // Directional light
    directionalLight = new DirectionalLight(0xFFFFFF, 0);
    scene.add(directionalLight);

    directionalLight.position.set(0, -30, 50);
    // Light must cast shadows, otherwise the rest of the shadow configurations won't work
    directionalLight.castShadow = true;
    // Increasing the size of the the shadow camera
    directionalLight.shadow.camera.top = halfFieldHeight;
    directionalLight.shadow.camera.bottom = -halfFieldHeight;
    directionalLight.shadow.camera.right = halfFieldWidth + height;
    directionalLight.shadow.camera.left = -halfFieldWidth - height;

    // Spotlight
    spotlight1 = new SpotLight(0xFFFFFF, 400);
    spotlight1.angle = 0;
    spotlight1.position.set(0, orbitY, orbitRadius * Math.sin(orbitAngle));
    scene.add(spotlight1);

    // Add directional light helper to visualize source
    // Second argument defines the size
    // let dLIghtHelper = new DirectionalLightHelper(directionalLight, 5);
    // scene.add(dLIghtHelper);

    // Add helper for the shadow camera
    // let dLightShadowHelper = new CameraHelper(directionalLight.shadow.camera);
    // scene.add(dLightShadowHelper);
}

function prepareField() {
    // Standard material for reuse
    standardMaterial = new MeshStandardMaterial({ color: color.walls });
    scoreboardMaterial = new MeshStandardMaterial({ color: color.points });

    // Adding boxes for edges
    boxGeometry1 = new BoxGeometry(height, chunkSize, height);
    boxGeometry2 = new BoxGeometry(fieldWidth + height * 2, height, height);
    box_t = new Mesh(boxGeometry2, standardMaterial);
    box_b = new Mesh(boxGeometry2, standardMaterial);
    // 10 chunks of sides to later behave as the scoreboard
    chunks_r = {
        box_r10: new Mesh(boxGeometry1, standardMaterial),
        box_r9: new Mesh(boxGeometry1, standardMaterial),
        box_r8: new Mesh(boxGeometry1, standardMaterial),
        box_r7: new Mesh(boxGeometry1, standardMaterial),
        box_r6: new Mesh(boxGeometry1, standardMaterial),
        box_r5: new Mesh(boxGeometry1, standardMaterial),
        box_r4: new Mesh(boxGeometry1, standardMaterial),
        box_r3: new Mesh(boxGeometry1, standardMaterial),
        box_r2: new Mesh(boxGeometry1, standardMaterial),
        box_r1: new Mesh(boxGeometry1, standardMaterial),
    }
    chunks_l = {
        box_l10: new Mesh(boxGeometry1, standardMaterial),
        box_l9: new Mesh(boxGeometry1, standardMaterial),
        box_l8: new Mesh(boxGeometry1, standardMaterial),
        box_l7: new Mesh(boxGeometry1, standardMaterial),
        box_l6: new Mesh(boxGeometry1, standardMaterial),
        box_l5: new Mesh(boxGeometry1, standardMaterial),
        box_l4: new Mesh(boxGeometry1, standardMaterial),
        box_l3: new Mesh(boxGeometry1, standardMaterial),
        box_l2: new Mesh(boxGeometry1, standardMaterial),
        box_l1: new Mesh(boxGeometry1, standardMaterial),
    }

    for (let boxNumber in chunks_r) {
        scene.add(chunks_r[boxNumber]);
        chunks_r[boxNumber].castShadow = true;
        chunks_r[boxNumber].receiveShadow = true;
    }

    for (let boxNumber in chunks_l) {
        scene.add(chunks_l[boxNumber]);
        chunks_l[boxNumber].castShadow = true;
        chunks_l[boxNumber].receiveShadow = true;
    }

    for (let i = 1; i <= 10; i++) {
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
}

// Adding fancy corners
function prepareCorners() {
    cornerGeometry = new OctahedronGeometry(height * 0.7, 0);
    corner1 = new Mesh(cornerGeometry, standardMaterial);
    corner2 = new Mesh(cornerGeometry, standardMaterial);
    corner3 = new Mesh(cornerGeometry, standardMaterial);
    corner4 = new Mesh(cornerGeometry, standardMaterial);
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

// Adding paddles
function preparePaddles() {
    paddleLeftGeometry = new BoxGeometry(paddleWidth, paddleLength, height);
    paddleRightGeometry = new BoxGeometry(paddleWidth, paddleLength, height);
    paddleMaterial = new MeshStandardMaterial({ color: color.paddles });
    paddleLeft = new Mesh(paddleLeftGeometry, paddleMaterial);
    paddleRight = new Mesh(paddleRightGeometry, paddleMaterial);
    paddleRight.position.set(halfFieldWidth - paddleWallDist, 0, height / 2);
    paddleLeft.position.set(-halfFieldWidth + paddleWallDist, 0, height / 2);
    paddleLeft.castShadow = true;
    paddleRight.castShadow = true;
    paddleLeft.receiveShadow = true;
    paddleRight.receiveShadow = true;
    scene.add(paddleLeft);
    scene.add(paddleRight);
}

// Adding ball
function prepareBall() {
    sphereGeometry = new SphereGeometry(ballRadius);
    sphereMaterial = new MeshStandardMaterial({ color: color.ball });
    sphere = new Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.set(0, 0, ballRadius);
    // Adding a movement vector property
    sphere.movementVector = new Vector2(0, 0);
};

function initializeObjs() {
    prepareBasics();
    preparePlane();
    prepareLights();
    prepareField();
    prepareCorners();
    preparePaddles();
    prepareBall();
}

// Load all necessary avatars to choose after
function loadImages() {
    let imagePromises = avatarsToLoad.map(id => {
        let picture = document.getElementById(id);
        return new Promise((resolve, reject) => {
            if (picture.complete)
                resolve();
            picture.addEventListener('load', resolve);
            picture.addEventListener('error', () => {
                reject(new Error("Failed to load avatar"));
            });
        });
    });
    // Return a promise that resolves when all images have loaded
    return Promise.all(imagePromises);
}

// Choose which avatars to use and their respective side
function prepareAvatars() {
    img1 = gameData[1].Side == 0 ? document.getElementById(avatarsToLoad[0]).src : document.getElementById(avatarsToLoad[1]).src;
    img2 = gameData[2].Side == 0 ? document.getElementById(avatarsToLoad[0]).src : document.getElementById(avatarsToLoad[1]).src;
}

// Adding picture tablets
function createTexturedMeshes() {
    imgLoader = new TextureLoader();
    // Create promises for the texture loading and mesh creation
    meshPromises = [
        new Promise((resolve, reject) => {
            imgLoader.load(img1, function (texture) {
                let geometry = new PlaneGeometry(tabletSize, tabletSize);
                let material = new MeshBasicMaterial({ map: texture });
                pic1 = new Mesh(geometry, material);
                resolve();
            }, () => {
                reject(new Error("Failed to create avatar mesh"));
            });
        }),
        new Promise((resolve, reject) => {
            imgLoader.load(img2, function (texture) {
                let geometry = new PlaneGeometry(tabletSize, tabletSize);
                let material = new MeshBasicMaterial({ map: texture });
                pic2 = new Mesh(geometry, material);
                resolve();
            }, () => {
                reject(new Error("Failed to create avatar mesh"));
            });
        })
    ];

    // Return a promise that resolves when all the meshes are created
    return Promise.all(meshPromises);
};

function placeLoadedAvatars() {
    scene.add(pic1);
    scene.add(pic2);
    pic1.position.set(-halfFieldWidth - tabletSize, halfFieldHeight - tabletSize / 2, 0);
    pic2.position.set(halfFieldWidth + tabletSize, halfFieldHeight - tabletSize / 2, 0);
}

function move() {
    if (!start)
        return;
    if (keys.ArrowUp && !keys.ArrowDown && paddleRight.position.y < halfFieldHeight - halfPaddleLength - lerpStep)
        paddleRight.position.lerp(new Vector3(paddleRight.position.x, paddleRight.position.y + lerpStep, paddleRight.position.z), paddleSpeed);
    if (keys.ArrowDown && !keys.ArrowUp && paddleRight.position.y > -halfFieldHeight + halfPaddleLength + lerpStep)
        paddleRight.position.lerp(new Vector3(paddleRight.position.x, paddleRight.position.y - lerpStep, paddleRight.position.z), paddleSpeed);
    if (keys.w && !keys.s && paddleLeft.position.y < halfFieldHeight - halfPaddleLength - lerpStep)
        paddleLeft.position.lerp(new Vector3(paddleLeft.position.x, paddleLeft.position.y + lerpStep, paddleLeft.position.z), paddleSpeed);
    if (keys.s && !keys.w && paddleLeft.position.y > -halfFieldHeight + halfPaddleLength + lerpStep)
        paddleLeft.position.lerp(new Vector3(paddleLeft.position.x, paddleLeft.position.y - lerpStep, paddleLeft.position.z), paddleSpeed);
}

// Defines ball direction at the beginning and resets
function ballStart() {
    sphere.position.set(0, 0, ballRadius);
    ballSpeed = ballInitialSpeed > minSpeed ? ballInitialSpeed : minSpeed;
    // Direction in radians to later decompose in x and y
    let rand = MathUtils.randFloatSpread(ballMaxAngle);
    let rand2 = Math.random();
    ballDirection = rand2 >= 0.5 ? rand : rand + Math.PI;
}

function checkAlignment(paddle) {
    return sphere.position.y - ballRadius < paddle.position.y + halfPaddleLength && sphere.position.y + ballRadius > paddle.position.y - halfPaddleLength;
}

function paddleLeftCollision() {
    return sphere.position.x - ballRadius < -paddleTotalDist && sphere.position.x - ballRadius > -paddleTotalDist - paddleWidth;
}

function paddleRightCollision() {
    return sphere.position.x + ballRadius > paddleTotalDist && sphere.position.x + ballRadius < paddleTotalDist + paddleWidth;
}

function bounceSpeed(multiplier) {
    let speed = ballSpeed * ballHitSpeed * multiplier * (1 + multiplier);
    speed = speed > maxSpeed ? maxSpeed : speed;
    speed = speed < minSpeed ? minSpeed : speed;
    return speed;
}

function bounce(side, paddle) {
    // The multiplier will act as a percentage.
    // The further the ball hits from the center of the paddle, the higher the multiplier
    let multiplier = Math.abs((sphere.position.y - paddle.position.y) / halfPaddleLength);
    ballSpeed = bounceSpeed(multiplier);
    ballDirection = (sphere.position.y - paddle.position.y) / (halfPaddleLength + ballRadius) * ballMaxAngle;
    if (side)
        ballDirection = Math.PI - ballDirection;
    bounceCount[side]++;
    // Add AI error for next hit calculation
    // The error will be present 50% of the times
    if (Math.random() >= 0.5)
        aiError = Math.random() * (halfPaddleLength * 1.2 - halfPaddleLength) + halfPaddleLength;
    else
        aiError = 0;
}

function collision() {
    if (!start)
        return;
    if (checkAlignment(paddleLeft) && paddleLeftCollision()) {
        bounce(0, paddleLeft);
    }
    else if (checkAlignment(paddleRight) && paddleRightCollision()) {
        bounce(1, paddleRight);
    }
    else if (sphere.position.x + ballRadius >= halfFieldWidth) {
        for (let boxNumber in chunks_l) {
            if (chunks_l[boxNumber].material === standardMaterial) {
                chunks_l[boxNumber].material = scoreboardMaterial;
                scores[0]++;
                scene.remove(scoreboard[0]);
                scoreboard[0] = getScore(scores[0]);
                scoreDisplay();
                if (boxNumber === 'box_l1') {
                    paddleSpeed = 0;
                    start = false;
                    finishGame();
                    return;
                }
                break;
            }
        }
        ballStart();
    }
    else if (sphere.position.x - ballRadius <= -halfFieldWidth) {
        for (let boxNumber in chunks_r) {
            if (chunks_r[boxNumber].material === standardMaterial) {
                chunks_r[boxNumber].material = scoreboardMaterial;
                scores[1]++;
                scene.remove(scoreboard[1]);
                scoreboard[1] = getScore(scores[1]);
                scoreDisplay();
                if (boxNumber === 'box_r1') {
                    paddleSpeed = 0;
                    start = false;
                    finishGame();
                    return;
                }
                break;
            }
        }
        ballStart();
    }
    // Check if the ball hits the top or bottom of the field
    // Also, check if the ball has bounced recently (this avoids the sticky ball problem)
    else if (((sphere.position.y + ballRadius >= halfFieldHeight)
        || (sphere.position.y - ballRadius <= -halfFieldHeight))
        && Date.now() - lastBounceTime > bounceCooldown) {
        ballDirection = -ballDirection;
        lastBounceTime = Date.now();
    }
}

function updateBallPosition(delta) {
    if (!start)
        return;
    const distance = ballSpeed * delta;
    let increment = new Vector3(distance * Math.cos(ballDirection), distance * Math.sin(ballDirection), 0);
    sphere.position.add(increment);
    increment.normalize();
    sphere.movementVector = increment;
}

function updateGameLogic(delta) {
    move();
    updateBallPosition(delta);
    collision();
}

function adjustLights() {
    spotlight1.intensity -= delta * 100;
    if (spotlight1.intensity <= 0) {
        scene.remove(spotlight1);
        if (directionalLight.intensity < 1) {
            directionalLight.intensity += delta / 2;
            ambientLight.intensity += delta / 2;
        }
        else
            ready = true;
    }
}

function spotlightOrbit() {
    const rotSpeed = 0.02;
    spotlight1.position.y = orbitRadius * Math.cos(orbitAngle);
    spotlight1.position.z = orbitRadius * Math.sin(orbitAngle);
    orbitAngle += rotSpeed;
}

function lights(delta) {
    if (spotlight1.angle < Math.PI / 64)
        spotlight1.angle += delta / 75;
    else if (spotlight1.position.y > -orbitY)
        spotlightOrbit();
    else
        lightsOn = true
}

function animateCamera() {
    if (!startCam || start)
        return;
    if (camera.position.z < defaultCameraZ)
        camera.position.lerp(new Vector3(camera.position.x, camera.position.y, camera.position.z + lerpStep * 2), 1);
    if (camera.position.y < defaultCameraY)
        camera.position.lerp(new Vector3(camera.position.x, camera.position.y + lerpStep / 1.2, camera.position.z), 1);
    camera.lookAt(0, 0, 0);
}

function animate() {
    delta = clock.getDelta();
    ticks = Math.round(delta * 120);
    if (!lightsOn)
        lights(delta);
    else
        adjustLights(delta);
    if (camera && camera.position.z != defaultCameraZ && camera.position.y != defaultCameraY)
        animateCamera();
    cameraMotion();
    for (let i = 0; i < ticks; i++)
        updateGameLogic(delta / ticks);
    cpuPlayers(cpu[0], cpu[1]);
    // The render method links the camera and the scene
    if (camera)
        renderer.render(scene, camera);
}

// COMMENT
// For dat.gui controls
// function guiControls() {
//     gui = new GUI();

//     let options = {
//         ballMaxAngle: 60,
//         paddleSpeed: 1.5,
//         maxSpeed: 30,
//         minSpeed: 20,
//         ballHitSpeed: 1.5,
//         ballInitialSpeed: 10,
//         camOrbit: 20,
//         camOrbitSpeed: 0,
//         // updateAI: 100
//     };

//     gui.add(options, 'ballMaxAngle').min(30).max(90).step(1).onChange(function (value) {
//         ballMaxAngle = value * Math.PI / 180;
//     });

//     gui.add(options, 'paddleSpeed').min(1).max(3).step(0.1).onChange(function (value) {
//         paddleSpeed = value;
//     });

//     gui.add(options, 'maxSpeed').min(2).max(50).step(1).onChange(function (value) {
//         maxSpeed = value;
//     });

//     gui.add(options, 'minSpeed').min(1).max(30).step(1).onChange(function (value) {
//         minSpeed = value;
//     });

//     gui.add(options, 'ballHitSpeed').min(1).max(2).step(0.1).onChange(function (value) {
//         ballHitSpeed = value;
//     });

//     gui.add(options, 'ballInitialSpeed').min(1).max(50).step(1).onChange(function (value) {
//         ballInitialSpeed = value;
//     });

//     gui.add(options, 'camOrbit').min(0).max(100).step(1).onChange(function (value) {
//         camOrbit = value;
//     });

//     gui.add(options, 'camOrbitSpeed').min(0.0).max(0.1).step(0.01).onChange(function (value) {
//         camOrbitSpeed = value;
//     });

//     // gui.add(options, 'updateAI').min(100).max(1000).step(100).onChange(function (value) {
//     //     updateAI = value;
//     //     clearInterval(interval);
//     //     updateInterval();
//     // });
// }

function cameraMotion() {
    if (!start)
        return;
    camTime += camOrbitSpeed;
    camera.position.x = Math.sin(camTime) * camOrbit;
    camera.position.y = Math.sin(camTime) * Math.cos(camTime) * camOrbit;
    camera.lookAt(0, 0, 0);
}

function onKeyDown(e) {
    if (e.key in keys
        && (((e.key == 'w' || e.key == 's') && !cpu[0])
            || ((e.key == 'ArrowUp' || e.key == 'ArrowDown') && !cpu[1]))) {
        keys[e.key] = true;
    }
}

function onKeyUp(e) {
    if (e.key in keys) {
        keys[e.key] = false;
    }
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onSpacePress(e) {
    if (e.code === 'Space' && !startCam && ready) {
        startCam = true;
        scene.remove(text4);
    }
    else if (e.code === 'Space' && startCam && Math.floor(camera.position.z) == defaultCameraZ && Math.floor(camera.position.y) == defaultCameraY) {
        scene.remove(text1);
        scene.remove(text2);
        scene.remove(text3);
        start = true;
        updateInterval();
    }
}

function onSkipAnimation(e) {
    if (!start && e.code === 'KeyY') {
        camera.position.set(0, defaultCameraY, defaultCameraZ);
        camera.lookAt(0, 0, 0);
        scene.remove(spotlight1);
        scene.remove(text4);
        directionalLight.intensity = 1;
        ambientLight.intensity = 1;
        lightsOn = true;
        startCam = true;
    }
}

// If the user leaves the game page before the game is finished
// the game logic must stop and clean up
function gameAborted() {
    let gameView = document.getElementById('play-1-vs-1-local');
    let observer = new MutationObserver(function () {
        if (window.getComputedStyle(gameView).display === 'none' && start) {
            start = false;
            finishGame();
        }
    });
    observer.observe(gameView, { attributes: true, attributeFilter: ['style', 'class'] });
    return observer;
}

function readyEventListeners() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onSpacePress);
    window.addEventListener('keydown', onSkipAnimation);
    abort = gameAborted();
}

function removeEventListeners() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('keydown', onSpacePress);
    window.removeEventListener('keydown', onSkipAnimation);
    abort.disconnect();
}

function createTextMeshes() {
    loader = new FontLoader();
    let url = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json';
    return (new Promise((resolve, reject) => {
        loader.load(url, function (font) {
            let textGeometry1 = new TextGeometry('Press space to start', {
                font: font,
                size: 2,
                depth: 0.5,
            });
            let textGeometry2 = new TextGeometry('W\n\n\n\nS', {
                font: font,
                size: 1,
                depth: 0.5,
            });
            let textGeometry3 = new TextGeometry('   Up arrow\n\n\n\nDown arrow', {
                font: font,
                size: 1,
                depth: 0.5,
            });
            let textGeometry4 = new TextGeometry('press space', {
                font: font,
                size: 1,
                depth: 0.5,
            });
            let textMaterial = new MeshStandardMaterial({ color: color.text });
            text1 = new Mesh(textGeometry1, textMaterial);
            text2 = new Mesh(textGeometry2, textMaterial);
            text3 = new Mesh(textGeometry3, textMaterial);
            text4 = new Mesh(textGeometry4, textMaterial);
            if (text1 && text2 && text3 && text4)
                resolve();
            else
                reject(new Error("Failed to create text meshes"));
        });
    }, () => {
        reject(new Error("Failed to load font"));
    }));
}

function textDisplay() {
    text1.position.set(-12, -5, 10);
    text1.receiveShadow = true;
    text2.position.set(-18.5, 3, 1);
    text2.receiveShadow = true;
    text3.position.set(12, 3, 1);
    text3.receiveShadow = true;
    text4.position.set(-3.6, halfFieldHeight, 0.2);
    text4.rotateX(Math.PI / 2);
    scene.add(text1);
    scene.add(text2);
    scene.add(text3);
    scene.add(text4);
}

function scoreDisplay() {
    for (let i = 0; i < 2; i++)
        scoreboard[i].geometry.computeBoundingBox();
    let scoreLeftWidth = scoreboard[0].geometry.boundingBox.max.x - scoreboard[0].geometry.boundingBox.min.x;
    let scoreRightWidth = scoreboard[1].geometry.boundingBox.max.x - scoreboard[1].geometry.boundingBox.min.x;
    scoreboard[0].position.set(-halfFieldWidth - tabletSize - (scoreLeftWidth / 2), +tabletSize, 0);
    scoreboard[1].position.set(halfFieldWidth + tabletSize - (scoreRightWidth / 2), +tabletSize, 0);
    for (let i = 0; i < 2; i++)
        scene.add(scoreboard[i]);
}

function nameDisplay() {
    // Compute the bounding box of the text geometry
    nameLeft.geometry.computeBoundingBox();
    nameRight.geometry.computeBoundingBox();
    // Get the width of the bounding boxes
    const nameLeftWidth = nameLeft.geometry.boundingBox.max.x - nameLeft.geometry.boundingBox.min.x;
    const nameRightWidth = nameRight.geometry.boundingBox.max.x - nameRight.geometry.boundingBox.min.x;
    // Place the names below the tablets, centered
    nameLeft.position.set(-halfFieldWidth - tabletSize - (nameLeftWidth / 2), halfFieldHeight - tabletSize - 1.5, 0);
    nameRight.position.set(halfFieldWidth + tabletSize - (nameRightWidth / 2), halfFieldHeight - tabletSize - 1.5, 0);
    scene.add(nameLeft);
    scene.add(nameRight);
}

function cpuMove(player, intersect) {
    let slack = lerpStep * 2;
    switch (player) {
        case 0:
            if (paddleLeft.position.y < intersect + aiError + slack && paddleLeft.position.y > intersect - aiError - slack) {
                keys.s = false;
                keys.w = false;
            }
            else if (paddleLeft.position.y < (intersect - aiError)) {
                keys.w = true;
                keys.s = false;
            }
            else if (paddleLeft.position.y > (intersect + aiError)) {
                keys.s = true;
                keys.w = false;
            }
            break;
        case 1:
            if (paddleRight.position.y < intersect + aiError + slack && paddleRight.position.y > intersect - aiError - slack) {
                keys.ArrowDown = false;
                keys.ArrowUp = false;
            }
            else if (paddleRight.position.y < (intersect - aiError)) {
                keys.ArrowUp = true;
                keys.ArrowDown = false;
            }
            else if (paddleRight.position.y > (intersect + aiError)) {
                keys.ArrowDown = true;
                keys.ArrowUp = false;
            }
            break;
    }
}

function calcImpact(currX, currY, vec) {
    let m = vec.y / vec.x;
    let b = currY - m * currX;
    if (vec.x > 0) {
        let yRight = m * (paddleTotalDist - currX) + currY;
        if (Math.abs(yRight) <= halfFieldHeight)
            return yRight;
    }
    else {
        let yLeft = m * (-paddleTotalDist - currX) + currY;
        if (Math.abs(yLeft) <= halfFieldHeight)
            return yLeft;
    }
    if (!vec.y)
        return currX;
    else if (vec.y > 0) {
        let xTop = (halfFieldHeight - b) / m;
        if (Math.abs(xTop) <= paddleTotalDist)
            return calcImpact(xTop, halfFieldHeight - ballRadius, new Vector2(vec.x, -vec.y));
    }
    else {
        let xBottom = (-halfFieldHeight - b) / m;
        if (Math.abs(xBottom) <= paddleTotalDist)
            return calcImpact(xBottom, -halfFieldHeight + ballRadius, new Vector2(vec.x, -vec.y));
    }
}

// Get the updated vector of the ball (for AI logic)
// This is called once per second
function getBallUpdate() {
    currBallPosX = sphere.position.x;
    currBallPosY = sphere.position.y;
    aiVec = sphere.movementVector;
}

// This is called when the game starts
function updateInterval() {
    interval = setInterval(getBallUpdate, updateAI);
}

function cpuPlayers(left, right) {
    if (!start || (!aiVec.x && !aiVec.y))
        return;
    let hit = calcImpact(currBallPosX, currBallPosY, aiVec);
    if (left) {
        if (aiVec.x > 0) {
            cpuMove(0, 0);
        } else {
            cpuMove(0, hit);
        }
    }
    if (right) {
        if (aiVec.x < 0) {
            cpuMove(1, 0);
        } else {
            cpuMove(1, hit);
        }
    }
}

function nameSelect(side) {
    return (gameData[1].Side == side ? gameData[1].Name : gameData[2].Name).substring(0, 5);
}

function loadNameMeshes() {
    return new Promise((resolve, reject) => {
        names = [nameSelect(0), nameSelect(1)];
        const loader = new FontLoader();
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const nameLeftGeometry = new TextGeometry(names[0], {
                font: font,
                size: 1,
                depth: 0.5,
            });
            const nameRightGeometry = new TextGeometry(names[1], {
                font: font,
                size: 1,
                depth: 0.5,
            });
            const nameMaterial = new MeshStandardMaterial({ color: color.text });
            nameLeft = new Mesh(nameLeftGeometry, nameMaterial);
            nameRight = new Mesh(nameRightGeometry, nameMaterial);
            resolve();
        }, undefined, () => {
            reject(new Error("Failed to load name mesh"));
        });
    });
};

function sendData() {
    gameData[0]['Match Time'] = matchTime;
    if (scores[0] != 10 && scores[1] != 10)
        gameData[0]['Game aborted'] = 'Yes';
    gameData[1].Score = scores[gameData[1].Side];
    gameData[2].Score = scores[gameData[2].Side];
    gameData[1].Bounces = bounceCount[gameData[1].Side];
    gameData[2].Bounces = bounceCount[gameData[2].Side];
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

function disposeObject(obj) {
    if (obj) {
        if (obj.geometry) {
            obj.geometry.dispose();
        }
        if (obj.material) {
            obj.material.dispose();
        }
        scene.remove(obj);
    }
}

function finishGame() {
    // Stop match clock
    clearInterval(timer);
    clearInterval(interval);
    // Deep cleaning, nothing left behind
    renderer.setAnimationLoop(null);
    disposeObject(plane);
    disposeObject(ambientLight);
    disposeObject(directionalLight);
    disposeObject(spotlight1);
    Object.values(chunks_r).forEach(disposeObject);
    Object.values(chunks_l).forEach(disposeObject);
    disposeObject(box_t);
    disposeObject(box_b);
    disposeObject(corner1);
    disposeObject(corner2);
    disposeObject(corner3);
    disposeObject(corner4);
    disposeObject(paddleLeft);
    disposeObject(paddleRight);
    disposeObject(sphere);
    disposeObject(pic1);
    disposeObject(pic2);
    disposeObject(text1);
    disposeObject(text2);
    disposeObject(text3);
    disposeObject(text4);
    Object.values(scoreboard).forEach(disposeObject);
    imgLoader = null;
    meshPromises = null;
    removeEventListeners();
    camera = null;
    scene = null;
    renderer.dispose();
    document.getElementById('pong').style.display = 'none';
    document.getElementById('play-1-vs-1-local').style.display = 'none';
    sendData();
    for (let key in keys)
        keys[key] = false;
    matchTime = 0;
    bounceCount = [0, 0];
    avatarsToLoad = [0, 0];
    img1 = 0;
    img2 = 0;
    // if (gui)
    //     gui.destroy();
    // Game over event
    let event = new CustomEvent('gameOver', {
        detail: {
            'gameData': localStorage.getItem('gameData')
        }
    });
    document.dispatchEvent(event);
}

function chooseAI() {
    for (let i = 0; i < 3; i++)
        if (!gameData[i].AI)
            cpu[gameData[i].Side] = 0;
}

function prepVars() {
    clock = new Clock();
    delta = 0;
    ticks = 0;
    lightsOn = false;
    ready = false;
    startCam = false;
    start = false;
    paddleSpeed = 1.5;
    lastBounceTime = 0;
    scores = [0, 0];
    names = [];
    nameLeft = null;
    nameRight = null;
    scoreboard = [0, 0];
    bounceCount = [0, 0];
    cpu = [1, 1];
    timer = null;
    matchTime = 0;
    dX = 0;
    dY = 0;
    currBallPosX = 0;
    currBallPosY = 0;
    prevVec = { x: null, y: null };
    for (let key in keys)
        keys[key] = false;
    avatarsToLoad = [gameData[1].Avatar, gameData[2].Avatar];
    updateAI = 1000;
    aiError = 0;
    abort = null;
    // gui = null;
    aiVec = new Vector2(0, 0);
    text1 = null;
    text2 = null;
    text3 = null;
    text4 = null;
    zero = null;
    one = null;
    two = null;
    three = null;
    four = null;
    five = null;
    six = null;
    seven = null;
    eight = null;
    nine = null;
    ten = null;
}

async function main() {
    prepVars();
    chooseAI();
    initializeObjs();
    readyEventListeners();
    try {
        await loadImages();
        prepareAvatars();
        await createTexturedMeshes();
        placeLoadedAvatars();
        await createTextMeshes();
        textDisplay();
        await loadScoreMeshes(color);
        scoreboard = [getScore(scores[0]), getScore(scores[0])];
        scoreDisplay();
        await loadNameMeshes();
        nameDisplay();
    } catch (error) {
        console.error(error);
        finishGame();
        return;
    }
    ballStart();
    // guiControls();
    timer = setInterval(() => {
        matchTime++;
    }, 1000);
    renderer.setAnimationLoop(animate);
}

function getPlayerAvatars() {
    if (playerStatesPong['p1'] == "center")
        p1Avatar = "Avatar-AI-L1";
    else
        p1Avatar = `player-choosed-${playerStatesPong['p1']}-side`;
    if (playerStatesPong['p2'] == "center")
        p2Avatar = "Avatar-AI-L2";
    else
        p2Avatar = `player-choosed-${playerStatesPong['p2']}-side`;
}

function getPlayerPositions() {
    if (playerStatesPong['p1'] == "left")
        p1Side = 0;
    else if (playerStatesPong['p1'] == "right")
        p1Side = 1;
    else {
        if (playerStatesPong['p2'] == "left")
            p1Side = 1;
        else if (playerStatesPong['p2'] == "right")
            p1Side = 0;
        else
            p1Side = 0;
    }
    if (playerStatesPong['p2'] == "left")
        p2Side = 0;
    else if (playerStatesPong['p2'] == "right")
        p2Side = 1;
    else {
        if (playerStatesPong['p1'] == "left")
            p2Side = 1;
        else if (playerStatesPong['p1'] == "right")
            p2Side = 0;
        else
            p2Side = 1;
    }
}

function getPlayerName(player) {
    let name;
    if (playerStatesPong[player] == "left")
        name = document.querySelector('.left-side-player p').textContent;
    else if (playerStatesPong[player] == "right")
        name = document.querySelector('.right-side-player p').textContent;
    else
        name = "AI";
    return name;
}

function prepGameData() {
    getPlayerPositions();
    getPlayerAvatars();

    gameData = [
        {
            "Game Type": "Simple",
            "Game aborted": "No",
            "Tournament": "No",
            "Round": "",
            "Match Time": 0,
        },
        {
            "AI": playerStatesPong['p1'] == "center" ? 1 : 0,
            "Name": getPlayerName('p1'),
            "Avatar": p1Avatar,
            "Side": p1Side,
            "Score": 0,
            "Bounces": 0
        },
        {
            "AI": playerStatesPong['p2'] == "center" ? 1 : 0,
            "Name": getPlayerName('p2'),
            "Avatar": p2Avatar,
            "Side": p2Side,
            "Score": 0,
            "Bounces": 0
        }
    ]
}

function getTournamentPlayerAvatar(player) {
    if (player.isAi) {
        return "Avatar-AI-L" + (Math.floor(Math.random() * 4) + 1);
    }
    else if (player.isHost) {
        return "profile-image-sidebar";
    }
    else {
        return "guest-avatar";
    }
}

function prepTournamentGameData(match) {
    const player1 = match.player1;
    const player2 = match.player2;
    const player1AI = player1.isAi ? 1 : 0;
    const player2AI = player2.isAi ? 1 : 0;

    gameData = [
        {
            "Game Type": "Simple",
            "Game aborted": "No",
            "Tournament": "Yes",
            "Round": match.roundName,
            "Match Time": 0,
        },
        {
            "AI": player1AI,
            "Name": player1.displayName,
            "Avatar": getTournamentPlayerAvatar(player1),
            "Side": 0,
            "Score": 0,
            "Bounces": 0,
            "PlayerInfo": player1
        },
        {
            "AI": player2AI,
            "Name": player2.displayName,
            "Avatar": getTournamentPlayerAvatar(player2),
            "Side": 1,
            "Score": 0,
            "Bounces": 0,
            "PlayerInfo": player2
        }
    ]
}

document.addEventListener('DOMContentLoaded', function () {
    const gameButton = document.getElementById('start-match');
    gameButton.addEventListener('click', startGame);
    function startGame() {
        prepGameData();
        document.getElementById('pong').style.display = 'block';
        main();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const tournamentGameButton = document.getElementById('hidden-next-match');
    tournamentGameButton.addEventListener('click', startTournamentGame);

    function startTournamentGame() {

        const match = tournamentManager.getNextMatch();
        if (match === null) {
            return;
        }
        prepTournamentGameData(match);
        document.getElementById('tournament-match').style.display = 'none';
        document.getElementById('play-1-vs-1-local').style.display = 'block';
        document.getElementById('pong').style.display = 'block';
        main();
    }
});
