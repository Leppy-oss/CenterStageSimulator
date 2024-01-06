import { GameDimensions } from "./HomeScreen";
import Pixel from "./obj/Pixel";

const maxWidth = 13,
	maxHeight = 12;

export default function ScoreChecker(game) {
	this.game = game;
	/**
	 * @type {Array<Array<Number>}
	 */
	this.adjacencyList = [];
	/**
	 * @type {Array<Pixel>}
	 */
	this.pixels = [];
	this.visitedBfs = new Set();
	this.board = this.createEmptyBoardMatrix();
	this.visitedMatrix = this.createEmptyBoardMatrix();
}

/**
 * @param {Array<Pixel>} pixelList List with all of the pixels; no specific format required
 * @returns {Object} Score breakdown for the given pixels on the backdrop; pixels still in motion are ignored
 */
ScoreChecker.prototype.checkScore = function(pixelList) {
	this.pixels = pixelList;
	this.adjacencyList = this.constructEmptyAdjacencyList();
	this.constructAdjacencyList();
	this.visitedBfs = new Set();
	var numMosaics = 0;
	for (let i = 0; i < this.pixels.length; i++) numMosaics += this.bfs(i);
	return {
		npixels: this.pixels.length,
		nmosaics: numMosaics,
		nlines: this.checkLines()
	};
}

/**
 * @returns {Number} The number of lines the pixels have reached
 */
ScoreChecker.prototype.checkLines = function() {
	for (let i = 0; i < maxHeight; i++) {
		for (const j of this.board[i]) {
			if (j > -1) return Math.min(Math.floor((maxHeight - i) / 3), 3);
		}
	}

	return 0;
}

/**
 * @returns {Number} Number of mosaics detected using BFS on the non-white pixel adjaacency list
 */
ScoreChecker.prototype.bfs = function(start) {
	const queue = [start];
	let mosaics = 0;
	while (queue.length) {
		const node = queue.shift();
		if (!this.visitedBfs.has(node)) {
			this.visitedBfs.add(node);
			if (this.adjacencyList[node].length == 2) {
				// checks to make sure the right color configuration is present for a mosaic
				const node1 = this.adjacencyList[node][0];
				const node2 = this.adjacencyList[node][1];
				if ((this.pixels[node1].color == this.pixels[node].color &&
						this.pixels[node2].color == this.pixels[node].color) ||
					(this.pixels[node1].color != this.pixels[node].color &&
						this.pixels[node2].color != this.pixels[node].color && this.pixels[node2].color != this.pixels[node1].color)) {
					if (this.adjacencyList[node1].length == 2 && this.adjacencyList[node2].length == 2) mosaics++;
				}
			}
			for (const neighbor of this.adjacencyList[node]) this.visitedBfs.add(neighbor);

			for (const neighbor of this.adjacencyList[node]) {
				queue.push(neighbor);
			}
		}
	}

	return mosaics;
}

/**
 * Creates an adjacency list representing connections between pixels
 */
ScoreChecker.prototype.constructAdjacencyList = function() {
	this.board = this.constructBoardRepresentation();
	this.visitedMatrix = this.createEmptyBoardMatrix();
	for (let i = 0; i < maxHeight; i++) {
		for (let j = 0; j < maxWidth; j++) this.floodFill(i, j, i, j);
	}
}

/**
 * Creates an empty adjacency list representing connections between pixels
 * @returns {Array<Array<Number>>} Adjacency list representing connections between pixels
 */
ScoreChecker.prototype.constructEmptyAdjacencyList = function() {
	const ret = [];
	for (const i in this.pixels) ret.push([]);
	return ret;
}

ScoreChecker.prototype.floodFill = function(i, j, fromI, fromJ) {
	if (this.empty(i, j)) return;
	if (this.board[fromI][fromJ] > -1 && this.board[i][j] > -1 && (fromI != i || fromJ != j) && this.adjacencyList[this.board[fromI][fromJ]].find((value) => value == this.board[i][j]) === undefined) {
		this.adjacencyList[this.board[fromI][fromJ]].push(this.board[i][j]);
		this.adjacencyList[this.board[i][j]].push(this.board[fromI][fromJ]);
	}
	if (this.visitedMatrix[i][j] > -1) return;
	this.visitedMatrix[i][j] = 1;
	this.floodFill(i - 1, j - 1, i, j);
	this.floodFill(i - 1, j + 1, i, j);
	this.floodFill(i + 1, j - 1, i, j);
	this.floodFill(i + 1, j + 1, i, j);
	this.floodFill(i, j - 2, i, j);
	this.floodFill(i, j + 2, i, j);
	return;
}

/**
 * Floodfill companion ScoreChecker.prototype.to check if the slot on the backdrop is invalid for further filling
 */
ScoreChecker.prototype.empty = function(i, j) {
	if (i < 0 || j < 0 || i > maxHeight - 1 || j > maxWidth - 1) return true;
	if (this.board[i][j] < 0) return true;
	return this.pixels[this.board[i][j]].color == 'white';
}

/**
 * Creates a matrix representing which slots on the board are occupied by pixels
 * @returns {Array<Array<Number>>} Matrix representing which slots on the board are occupied by pixels ([row][col] format)
 */
ScoreChecker.prototype.constructBoardRepresentation = function() {
	const matrix = this.createEmptyBoardMatrix();
	for (const i in this.pixels) {
		const index = this.calculateIndex(this.pixels[i]);
		matrix[index.y][index.x] = parseInt(i);
	}
	return matrix;
}

/**
 * @returns {Array<Array<Number>>}
 */
ScoreChecker.prototype.createEmptyBoardMatrix = function() {
	const ret = [];
	for (let i = 0; i < maxHeight; i++) {
		ret.push([]);
		for (let j = 0; j < maxWidth; j++) ret.at(i).push(-1);
	}
	return ret;
}

/**
 * Calculates x/y coords of a pixel, relative to the backdrop's rows and columns
 * @param {Pixel} pixel Input pixel
 * @returns {Object} coords in x/y format of the pixel on the backdrop
 */
ScoreChecker.prototype.calculateIndex = function(pixel) {
	return {
		x: Math.floor(pixel.body.position.x / GameDimensions[0] * maxWidth),
		y: Math.floor(pixel.body.position.y / GameDimensions[1] * maxHeight)
	}
}