import { CONE_DIAM } from "../HomeScreen";
import { inchesToGamePixels } from "../utils";
import { GameDimensions } from "../HomeScreen";
import { decomp } from 'poly-decomp';

/**
 * @param {Phaser.Scene} game The scene to create the cone in
 */
export default function Boundary(game) {
	this.game = game;
	this.boundary = this.game.matter.add.image(0, GameDimensions[1], 'white-pixel').setDisplaySize(2, 3);
	this.vertices = [parseVertex(0, -2.13)];
	for (let i = 2; i < 13; i++) this.vertices.push(parseVertex(1.5 * i, (i % 2 == 0) ? 0 : -2.13));
	this.vertices.push(parseVertex(21, -2.13));
	console.log(this.game.matter.vertices.clockwiseSort(this.vertices.flat()));
	this.body = this.game.matter.bodies.fromVertices(this.boundary.x, this.boundary.y, [
		decomp(this.game.matter.vertices.clockwiseSort(this.vertices.flat()))
		]
		, {
			isStatic: true,
			inertia: 1e9,
		});
	this.boundary.setExistingBody(this.body);
	this.boundary.setOrigin(0.5, 0.5);
}

const verticesToPath = (items) => {
	return items.reduce((accumulator, item, index) => {
		return `${accumulator}${item[0]} ${item[1]}${index < items.length - 1 ? " " : ""
			}`;
	}, "");
};

/**
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Object} Coordinates in object form
 */
const parseVertex = (x, y) => {
	return [
		inchesToGamePixels(x),
		GameDimensions[1] - inchesToGamePixels(y)
	]
}

Boundary.prototype.refreshBody = function () { }

Boundary.prototype.update = function () { }