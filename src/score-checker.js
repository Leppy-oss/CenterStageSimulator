import { GameDimensions } from "./HomeScreen";
import Pixel from "./obj/Pixel";

const maxWidth = 13,
	maxHeight = 12;

/**
 * @param {Array<Pixel>} pixels List with all of the pixels; no specific format required
 * @returns {Number} The current score of all the pixels on the specified backdrop
 */
export function checkScore(pixels) {
	const adjacencyList = constructAdjacencyList(pixels);
	let score = 0;
	return score;
}

/**
 * Creates an adjacency list representing connections between pixels
 * @param {Array<Pixel>} pixels List with all of the pixels; no specific format required
 * @returns {Array<Array<Number>>} Adjacency list representing connections between pixels
 */
function constructAdjacencyList(pixels) {
	const adjacencyList = [];
	const board = constructBoardRepresentation(pixels);
	for (const i in pixels) adjacencyList.push([]);
	return adjacencyList;
}

/**
 * Creates a matrix representing which slots on the board are occupied by pixels
 * @param {*} pixels 
 * @returns {Array<Array<Number>>} Matrix representing which slots on the board are occupied by pixels ([row][col] format)
 */
function constructBoardRepresentation(pixels) {
	const matrix = [];
	for (let i = 0; i < maxHeight; i++) {
		matrix.push([]);
		for (let j = 0; j < maxWidth; j++) {
			matrix.at(i).push(-1);
		}
	}
	for (const i in pixels) {
		const index = calculateIndex(pixels[i]);
		matrix[index.y][index.x] = i;
	}
	console.log(matrix);
	return matrix;
}

/**
 * Calculates x/y coords of a pixel, relative to the backdrop's rows and columns
 * @param {Pixel} pixel Input pixel
 * @returns {Object} coords in x/y format of the pixel on the backdrop
 */
function calculateIndex(pixel) {
	return {
		x: Math.floor(pixel.body.position.x / GameDimensions[0] * maxWidth),
		y: Math.floor(pixel.body.position.y / GameDimensions[1] * maxHeight)
	}
}