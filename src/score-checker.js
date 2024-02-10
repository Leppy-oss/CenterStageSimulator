import { GameDimensions } from "./HomeScreen";
import Pixel from "./obj/Pixel";

const maxWidth = 13,
	maxHeight = 12;

const mosaicColor = 0x00ECFF,
	lineColor = 0xDAFF00;

/**
 * @param {Phaser.Scene} game 
 */
export default function ScoreChecker(game) {
	this.game = game;
	/**
	 * @type {Array<Array<Number>>}
	 */
	this.adjacencyList = [];
	/**
	 * @type {Array<Pixel>}
	 */
	this.pixels = [];
	this.lineVisualizations = [];
	this.visitedBfs = new Set();
	this.board = this.createEmptyBoardMatrix();
	this.visitedMatrix = this.createEmptyBoardMatrix();
	this.visitedMatrixVis = this.createEmptyBoardMatrix();
	/**
	 * @type {Array<Phaser.GameObjects.Line>}
	 */
	this.lines = [];
	this.mosaicLines = [];
	this.numFloodfill = 0;
	this.deleting = false;
}

/**
 * @param {Array<Pixel>} pixelList List with all of the pixels; no specific format required
 * @returns {Object} Score breakdown for the given pixels on the backdrop; pixels still in motion are ignored
 */
ScoreChecker.prototype.checkScore = function(pixelList) {
	// this.destroyLines();
	this.pixels = pixelList;
	this.numFloodfill = 0;
	this.destroyLines();
	this.destroyMosaicLines();
	this.adjacencyList = this.constructEmptyAdjacencyList();
	this.constructAdjacencyList();
	this.visitedBfs = new Set();
	var numMosaics = 0;
	for (let i = 0; i < this.pixels.length; i++) {
		numMosaics += this.bfs(i);
	}
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
	console.log(this.lines.length)
	const queue = [start];
	let mosaics = 0;
	let prevNode = start;
	while (queue.length) {
		const node = queue.shift();
		// console.log(node, prevNode);
		if (!this.visitedBfs.has(node)) {
			this.visitedBfs.add(node);
			if (this.adjacencyList[node].length == 2) {
				// checks to make sure the right color configuration is present for a mosaic
				const node1 = this.adjacencyList[node][0];
				const node2 = this.adjacencyList[node][1];
				if (this.pixels[node].color != 'white') {
					if ((this.pixels[node1].color == this.pixels[node].color &&
							this.pixels[node2].color == this.pixels[node].color) ||
						(this.pixels[node1].color != this.pixels[node].color &&
							this.pixels[node2].color != this.pixels[node].color && this.pixels[node2].color != this.pixels[node1].color)) {
						if (this.adjacencyList[node1].length == 2 && this.adjacencyList[node2].length == 2) {
							mosaics++;
							this.createMosaicLine(this.pixels[node].pixel.x, this.pixels[node].pixel.y, this.pixels[node1].pixel.x, this.pixels[node1].pixel.y);
							this.createMosaicLine(this.pixels[node1].pixel.x, this.pixels[node1].pixel.y, this.pixels[node2].pixel.x, this.pixels[node2].pixel.y);
							this.createMosaicLine(this.pixels[node].pixel.x, this.pixels[node].pixel.y, this.pixels[node2].pixel.x, this.pixels[node2].pixel.y);
						}
					}
				}
			}
			for (const neighbor of this.adjacencyList[node]) {
				this.visitedBfs.add(neighbor);
				queue.push(neighbor);
			}
			prevNode = node;
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
	this.visitedMatrixVis = this.createEmptyBoardMatrix();
	for (let i = 0; i < maxHeight; i++) {
		for (let j = 0; j < maxWidth; j++) {
			this.floodFill(i, j, i, j);
			this.floodFillVis(i, j, i, j);
		}
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
	if (this.wrongColor(i, j)) return;
	if ((this.board[fromI][fromJ] > -1 && this.board[i][j] > -1 && (fromI != i || fromJ != j) && this.adjacencyList[this.board[fromI][fromJ]].find((value) => value == this.board[i][j]) === undefined) && !this.wrongColor(i, j)) {
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

ScoreChecker.prototype.floodFillVis = function(i, j, fromI, fromJ) {
	if (this.empty(i, j)) return;
	if (this.board[fromI][fromJ] > -1 && this.board[i][j] > -1) {
		this.numFloodfill++;
		const pixelFrom = this.pixels[this.board[fromI][fromJ]].pixel;
		const pixelTo = this.pixels[this.board[i][j]].pixel;
		this.createLine(pixelFrom.x, pixelFrom.y, pixelTo.x, pixelTo.y, this.numFloodfill * 25);
	}
	if (this.visitedMatrixVis[i][j] > -1) return;
	this.visitedMatrixVis[i][j] = 1;
	this.floodFillVis(i - 1, j - 1, i, j);
	this.floodFillVis(i - 1, j + 1, i, j);
	this.floodFillVis(i + 1, j - 1, i, j);
	this.floodFillVis(i + 1, j + 1, i, j);
	this.floodFillVis(i, j - 2, i, j);
	this.floodFillVis(i, j + 2, i, j);
	return;
}

/**
 * Floodfill companion ScoreChecker.prototype.to check if the slot on the backdrop is invalid for further filling
 */
ScoreChecker.prototype.empty = function(i, j) {
	if (i < 0 || j < 0 || i > maxHeight - 1 || j > maxWidth - 1) return true;
	if (this.board[i][j] < 0) return true;
}

/**
 * Floodfill companion ScoreChecker.prototype.to check if the slot on the backdrop is invalid for further filling
 */
ScoreChecker.prototype.wrongColor = function(i, j) {
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

ScoreChecker.prototype.createLine = function(x1, y1, x2, y2, delay) {
	console.log('Delay: ' + delay);
	this.lineVisualizations.push({
		callback: () => this.lines.push(this.game.add.line(0, 0, x1, y1, x2, y2, lineColor, 0.5).setOrigin(0).setLineWidth(2).setVisible(true)),
		time: new Date().getTime() + delay
	});
}

ScoreChecker.prototype.createMosaicLine = function(x1, y1, x2, y2) {
	this.mosaicLines.push(this.game.add.line(0, 0, x1, y1, x2, y2, mosaicColor, 0.5).setOrigin(0).setLineWidth(2).setVisible(true));
}

ScoreChecker.prototype.update = function() {
	for (var i = 0; i < this.lineVisualizations.length; i++) {
		// console.log('Timestamp dt: ' + (new Date().getTime() - this.lineVisualizations[i].time))
		if (new Date().getTime() > this.lineVisualizations[i].time) {
			this.lineVisualizations[i].callback();
			this.lineVisualizations.splice(i, 1);
			i--;
		}
	}
	this.lines.forEach((line) => line.update());
	this.mosaicLines.forEach((line) => line.update());
}

ScoreChecker.prototype.destroyLines = function() {
	for (var i = 0; i < this.lines.length; i++) this.lines[i].setVisible(false).destroy();
	this.lines = [];
	this.lineVisualizations = [];
}

ScoreChecker.prototype.destroyMosaicLines = function() {
	for (var i = 0; i < this.mosaicLines.length; i++) this.mosaicLines[i].setVisible(false).destroy();
	this.mosaicLines = [];
}