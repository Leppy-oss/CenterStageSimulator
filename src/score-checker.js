import { GameDimensions } from "./HomeScreen";
import Pixel from "./obj/Pixel";

const maxWidth = 13,
	maxHeight = 12;
var board = createEmptyBoardMatrix();
var visitedMatrix = createEmptyBoardMatrix();
/**
 * @type {Array<Array<Number>>}
 */
var adjacencyList = [];
/**
 * @type {Array<Pixel>}
 */
var pixels = [];
var visitedBfs = new Set();

/**
 * @param {Array<Pixel>} pixelList List with all of the pixels; no specific format required
 * @returns {Object} Score breakdown for the given pixels on the backdrop; pixels still in motion are ignored
 */
export function checkScore(pixelList) {
	pixels = pixelList;
	/*
	for (const pixel of pixelList) {
		if (Math.sqrt(Math.pow(pixel.body.velocity.x, 2) + Math.pow(pixel.body.velocity.y, 2)) < 0.5) pixels.push(pixel);
	}
	*/
	adjacencyList = constructEmptyAdjacencyList();
	constructAdjacencyList();
	visitedBfs = new Set();
	var numMosaics = 0;
	for (let i = 0; i < pixels.length; i++) numMosaics += bfs(i);
	return {
		npixels: pixels.length,
		nmosaics: numMosaics,
		nlines: checkLines()
	};
}

/**
 * @returns {Number} The number of lines the pixels have reached
 */
function checkLines() {
	for (let i = 0; i < maxHeight; i++) {
		for (const j of board[i]) {
			if (j > -1) return Math.min(Math.floor((maxHeight - i) / 3), 3);
		}
	}

	return 0;
}

/**
 * @returns {Number} Number of mosaics detected using BFS on the non-white pixel adjaacency list
 */
function bfs(start) {
	const queue = [start];
	let mosaics = 0;
	while (queue.length) {
		const node = queue.shift();
		if (!visitedBfs.has(node)) {
			visitedBfs.add(node);
			if (adjacencyList[node].length == 2) {
				// checks to make sure the right color configuration is present for a mosaic
				const node1 = adjacencyList[node][0];
				const node2 = adjacencyList[node][1];
				if ((pixels[node1].color == pixels[node].color
					&& pixels[node2].color == pixels[node].color) || 
					(pixels[node1].color != pixels[node].color
						&& pixels[node2].color != pixels[node].color && pixels[node2].color != pixels[node1].color)) {
							if (adjacencyList[node1].length == 2 && adjacencyList[node2].length == 2) mosaics++;
						}
			}
			for (const neighbor of adjacencyList[node]) visitedBfs.add(neighbor);

			for (const neighbor of adjacencyList[node]) {
				queue.push(neighbor);
			}
		}
	}

	return mosaics;
}

/**
 * Creates an adjacency list representing connections between pixels
 */
function constructAdjacencyList() {
	board = constructBoardRepresentation();
	visitedMatrix = createEmptyBoardMatrix();
	for (let i = 0; i < maxHeight; i++) {
		for (let j = 0; j < maxWidth; j++) floodFill(i, j, i, j);
	}
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
	if (board[fromI][fromJ] > -1 && board[i][j] > -1 && (fromI != i || fromJ != j) && adjacencyList[board[fromI][fromJ]].find((value) => value == board[i][j]) === undefined) {
		adjacencyList[board[fromI][fromJ]].push(board[i][j]);
		adjacencyList[board[i][j]].push(board[fromI][fromJ]);
	}
	if (visitedMatrix[i][j] > -1) return;
	visitedMatrix[i][j] = 1;
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
	if (board[i][j] < 0) return true;
	return pixels[board[i][j]].color == 'white';
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