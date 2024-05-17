// Color palettes for the game

// template
// export const palette_name = {
// 	field: 0x,
// 	walls: 0x,
// 	paddles: 0x,
// 	ball: 0x,
// 	points: 0x,
// 	background: 0x,
//	text: 0x,
// }

export const memphis = {
	field: 0x5D76A9,
	walls: 0x12173F,
	paddles: 0x707271,
	ball: 0xF5B112,
	points: 0x00b2a9,
	background: 0x333333,
	text: 0x000000
}

export const lakers = {
		field: 0xF9A01B,
		walls: 0x552583,
		paddles: 0x552583,
		ball: 0x552583,
		points: 0xAA0000,
		background: 0x333333,
		text: 0x000000
}

export const phoenix = {
		field: 0xB95915,
		walls: 0xE56020,
		paddles: 0xBEC0C2,
		ball: 0x1D1160,
		points: 0xEF3340,
		background: 0x333333,
		text: 0x000000
}

export const charlotte = {
		field: 0xA1A1A4,
		walls: 0x1D1160,
		paddles: 0x00788C,
		ball: 0x280071,
		points: 0xF9423A,
		background: 0x333333,
		text: 0x000000
}

export const minnesota = {
		field: 0x9EA2A2,
		walls: 0x0C2340,
		paddles: 0x236192,
		ball: 0x78BE20,
		points: 0xFFFFFF,
		background: 0x333333,
		text: 0x000000
}

export const olympic = {
		field: 0x41427B,
		walls: 0x2E312A,
		paddles: 0xBC424F,
		ball: 0xFFFFFF,
		points: 0xDFE3EC,
		background: 0x333333,
		text: 0x000000
}

export const space = {
		field: 0x332941,
		walls: 0x3B3486,
		paddles: 0x864AF9,
		ball: 0xF8E559,
		points: 0x864AF9,
		background: 0x333333,
		text: 0x000000
}

export const comet = {
		field: 0x1D2B53,
		walls: 0x7E2553,
		paddles: 0xFF004D,
		ball: 0xFAEF5D,
		points: 0xFF004D,
		background: 0x333333,
		text: 0x000000
}

export const dark_green = {
		field: 0x0F0F0F,
		walls: 0x232D3F,
		paddles: 0x005B41,
		ball: 0x008170,
		points: 0x005B41,
		background: 0x333333,
		text: 0x000000
}

export const vapor_wave = {
		field: 0x390A5A,
		walls: 0xB627A7,
		paddles: 0xF9F5F4,
		ball: 0xE9ED8F,
		points: 0xFF8AFF,
		background: 0x333333,
		text: 0xE9ED8F
}

export const blue_something = {
    field: 0x1A1A2E,      // Dark navy blue
    walls: 0xE94560,      // Bright red for walls to stand out
    paddles: 0xF5F5F5,    // Light grey for paddles to be easily seen
    ball: 0xFFD700,       // Gold for high visibility
    points: 0x00FF00,     // Bright green for score
    background: 0x0F3460, // Dark blue background, lighter than the field
    text: 0xFFFFFF        // White text for high contrast
}

export const gpt = {
    field: 0x001F3F,      // Navy blue
    walls: 0xA9A9A9,      // Dark grey
    paddles: 0xFFFFFF,    // White
    ball: 0xFFA500,       // Orange
    points: 0x00FF00,     // Bright green
    background: 0xD3D3D3, // Light grey
    text: 0xFFFFFF        // White
}

export const gpt_4_o = {
    field: 0x2E3440,      // Dark greyish blue
    walls: 0x88C0D0,      // Muted light blue
    paddles: 0xECEFF4,    // Very light grey, almost white
    ball: 0xEBCB8B,       // Warm beige
    points: 0xA3BE8C,     // Soft green
    background: 0x3B4252, // Dark blue-grey
    text: 0xD8DEE9        // Light grey, almost white
}


// If more palettes are added, add them to the array below
export function selectRandomPalette() {
	const palettes = [memphis, lakers, phoenix, charlotte, minnesota, olympic, space, comet, dark_green, vapor_wave]
	return palettes[Math.floor(Math.random() * palettes.length)]
}
