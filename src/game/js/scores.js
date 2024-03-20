import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {
	MeshStandardMaterial,
	Mesh} from 'three';
import * as colors from './colors.js';

let color = colors.vapor_wave;
let one, two, three, four, five, six, seven, eight, nine, ten;

export function loadScoreMeshes(){
	return new Promise((resolve, reject) => {
		const loader = new FontLoader();
		loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', function(font) {
			const geometry0 = new TextGeometry('0', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry1 = new TextGeometry('1', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry2 = new TextGeometry('2', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry3 = new TextGeometry('3', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry4 = new TextGeometry('4', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry5 = new TextGeometry('5', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry6 = new TextGeometry('6', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry7 = new TextGeometry('7', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry8 = new TextGeometry('8', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry9 = new TextGeometry('9', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const geometry10 = new TextGeometry('10', {
				font: font,
				size: 2,
				height: 0.5,
			});
			const material = new MeshStandardMaterial({color: color.points});
			zero = new Mesh(geometry0, material);
			one = new Mesh(geometry1, material);
			two = new Mesh(geometry2, material);
			three = new Mesh(geometry3, material);
			four = new Mesh(geometry4, material);
			five = new Mesh(geometry5, material);
			six = new Mesh(geometry6, material);
			seven = new Mesh(geometry7, material);
			eight = new Mesh(geometry8, material);
			nine = new Mesh(geometry9, material);
			ten = new Mesh(geometry10, material);
			resolve();
		}, undefined, function(error){
			reject(error);
		});
	});
};

// Returns a clone of the score mesh
export function getScore(score){
	switch(score){
		case 0:
			return zero.clone();
		case 1:
			return one.clone();
		case 2:
			return two.clone();
		case 3:
			return three.clone();
		case 4:
			return four.clone();
		case 5:
			return five.clone();
		case 6:
			return six.clone();
		case 7:
			return seven.clone();
		case 8:
			return eight.clone();
		case 9:
			return nine.clone();
		case 10:
			return ten.clone();
	}
};