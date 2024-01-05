import { GameDimensions } from "./HomeScreen";
import Pixel from "./obj/Pixel";

const maxWidth = 13,
	maxHeight = 12;
var board = createEmptyBoardMatrix();
var visited = createEmptyBoardMatrix();
/**
 * @type {Array<Array<Number>>}
 */
var adjacencyList = [];
/**
 * @type {Array<Pixel>}
 */
var pixels = [];

/**
 * @param {Array<Pixel>} pixelList List with all of the pixels; no specific format required
 * @returns {Number} The current score of all the pixels on the specified backdrop
 */
export function checkScore(pixelList) {
	pixels = pixelList;
	adjacencyList = constructEmptyAdjacencyList();
	constructAdjacencyList();
	let score = 0;
	return score;
}

/**
 * Creates an adjacency list representing connections between pixels
 */
function constructAdjacencyList() {
	board = constructBoardRepresentation();
	visited = createEmptyBoardMatrix();
	for (let i = 0; i < maxHeight; i++) {
		for (let j = 0; j < maxWidth; j++) floodFill(i, j, i, j);
	}
	console.log(adjacencyList);
}

/**
 * Creates an empty adjacency list representing connections between pixels
 * @returns {Array<Array<Number>>} Adjacency list representing connections between pixels
 */
function constructEmptyAdjacencyList() {
	const ret = [];
	for (const i in pixels) ret.push([]);
	return ret;
}

function floodFill(i, j, fromI, fromJ) {
	if (empty(i, j)) return;
	if (visited[i][j] > -1) return;
	visited[i][j] = 1;
	if ((fromI != i || fromJ != j) && board[fromI][fromJ] > -1) {
		console.log(i, j, fromI, fromJ);
		adjacencyList[board[fromI][fromJ]].push(board[i][j]);
		adjacencyList[board[i][j]].push(board[fromI][fromJ]);
	}
	floodFill(i - 1, j - 1, i, j);
	floodFill(i - 1, j + 1, i, j);
	floodFill(i + 1, j - 1, i, j);
	floodFill(i + 1, j + 1, i, j);
	floodFill(i, j - 2, i, j);
	floodFill(i, j + 2, i, j);
	return;
}

/**
 * Floodfill companion function to check if the slot on the backdrop is invalid for further filling
 */
function empty(i, j) {
	if (i < 0 || j < 0 || i > maxHeight - 1 || j > maxWidth - 1) return true;
	console.log(board[i][j])
	return (board[i][j] > -1 && pixels[board[i][j]].color != 'white');
}

/**
 * @returns {Array<Array<Number>>}
 */
function createEmptyBoardMatrix() {
	const ret = [];
	for (let i = 0; i < maxHeight; i++) {
		ret.push([]);
		for (let j = 0; j < maxWidth; j++) ret.at(i).push(-1);
	}
	return ret;
}

/**
 * Creates a matrix representing which slots on the board are occupied by pixels
 * @returns {Array<Array<Number>>} Matrix representing which slots on the board are occupied by pixels ([row][col] format)
 */
function constructBoardRepresentation() {
	const matrix = createEmptyBoardMatrix();
	for (const i in pixels) {
		const index = calculateIndex(pixels[i]);
		matrix[index.y][index.x] = parseInt(i);
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