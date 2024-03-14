// Color palettes for the game

// template
// export const palette_name = {
// 	field: 0x,
// 	walls: 0x,
// 	paddles: 0x,
// 	ball: 0x,
// 	points: 0x,
// 	background: 0x
// }

export const memphis = {
	field: 0x5D76A9,
	walls: 0x12173F,
	paddles: 0x707271,
	ball: 0xF5B112,
	points: 0x00b2a9,
	background: 0x333333
}

export const lakers = {
		field: 0xF9A01B,
		walls: 0x552583,
		paddles: 0x552583,
		ball: 0x552583,
		points: 0xAA0000,
		background: 0x333333
}

export const phoenix = {
		field: 0xB95915,
		walls: 0xE56020,
		paddles: 0xBEC0C2,
		ball: 0x1D1160,
		points: 0xEF3340,
		background: 0x333333
}

export const charlotte = {
		field: 0xA1A1A4,
		walls: 0x1D1160,
		paddles: 0x00788C,
		ball: 0x280071,
		points: 0xF9423A,
		background: 0x333333
}

export const minnesota = {
		field: 0x9EA2A2,
		walls: 0x0C2340,
		paddles: 0x236192,
		ball: 0x78BE20,
		points: 0xFFFFFF,
		background: 0x333333
}

export const olympic = {
		field: 0x41427B,
		walls: 0x2E312A,
		paddles: 0xBC424F,
		ball: 0xFFFFFF,
		points: 0xDFE3EC,
		background: 0x333333
}

// If more palettes are added, add them to the array below
export function selectRandomPalette() {
	const palettes = [memphis, lakers, phoenix, charlotte, minnesota, olympic]
	return palettes[Math.floor(Math.random() * palettes.length)]
}
