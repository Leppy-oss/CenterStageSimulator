import { GameDimensions } from "./HomeScreen";

/**
 * @param {any} inches Dimension in inches of the object
 * @returns The dimensions in pixels of the object as corresponding to the game/canvas
 */
export function inchesToGamePixels(inches) {
	return GameDimensions[0] / 20.96 * inches;
}

/**
 * Translates the x/y vector to a new one based on its heading and desired distance
 * @param {Number} distance - The distance to translate by
 * @param {Number} x - X coordinate of object
 * @param {Number} y - Y coordinate of object
 * @param {Number} heading - Heading to translate by, in RADIANS
 */
export function angledTranslation(distance, x, y, heading) {
	return [x + distance * Math.cos(heading), y + distance * Math.sin(heading)];
}

export const Vector2 = Phaser.Math.Vector2;

/**
 * Convert a number to a color using hsl, with range definition.
 * Example: if min/max are 0/1, and i is 0.75, the color is closer to green.
 * Example: if min/max are 0.5/1, and i is 0.75, the color is in the middle between red and green.
 * @param i (floating point, range 0 to 1)
 * param min (floating point, range 0 to 1, all i at and below this is red)
 * param max (floating point, range 0 to 1, all i at and above this is green)
 */
export function numberToColorHsl(i, min, max) {
	var ratio = i;
	if (min > 0 || max < 1) {
		if (i < min) {
			ratio = 0;
		} else if (i > max) {
			ratio = 1;
		} else {
			var range = max - min;
			ratio = (i - min) / range;
		}
	}

	// as the function expects a value between 0 and 1, and red = 0° and green = 120°
	// we convert the input to the appropriate hue value
	var hue = ratio * 1.2 / 3.60;
	//if (minMaxFactor!=1) hue /= minMaxFactor;

	// we convert hsl to rgb (saturation 100%, lightness 50%)
	var rgb = hslToRgb(hue, 1, 0.5);
	// we format to css value and return
	return 'rgb(' + (rgb[0] - 50) + ',' + (rgb[1] - 50) + ',' + (rgb[2] - 50) + ')';
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hueToRgb(p, q, h + 1 / 3);
		g = hueToRgb(p, q, h);
		b = hueToRgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}