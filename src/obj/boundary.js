import { CONE_DIAM } from "../HomeScreen";
import { inchesToGamePixels } from "../utils";
import { GameDimensions } from "../HomeScreen";

/**
 * @param {Phaser.Scene} game The scene to create the cone in
 */
export default function Boundary(game) {
	this.game = game;
	this.boundary = this.game.matter.add.image(-inchesToGamePixels(1.5), GameDimensions[1] + 15, 'white-pixel').setDisplaySize(2, 3);
	this.bodies = [];
	/*
	this.vertices = [parseVertex(0, -2.13)];
	for (let i = 2; i < 13; i++) this.vertices.push(parseVertex(20.96 / 14 * i, (i % 2 == 0) ? 0 : -1.05));
	this.vertices.push(parseVertex(21, -2.13));
	this.bodies = [
		this.game.matter.bodies.fromVertices(this.boundary.x, this.boundary.y, [
			this.vertices[0], this.vertices[1], this.vertices[2]
		])
	];
	for (let i = 2; i < 11; i += 2) {
		this.bodies.push(this.game.matter.bodies.fromVertices(this.boundary.x + this.vertices[i].x, this.boundary.y, [this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]], {
			isStatic: true,
			inertia: 1e9
		}));
	}
	*/
	for (let i = 1; i < 8; i++) {
		this.bodies.push(this.game.matter.bodies.polygon(this.boundary.x + i * 400/7, this.boundary.y, 6, 400/14*3.5/3));
	}
	this.bodies.push(this.game.matter.bodies.polygon(this.boundary.x + inchesToGamePixels(1.5), this.boundary.y - inchesToGamePixels(1.75 / 2), 6, inchesToGamePixels(1.75)));
	this.bodies.push(this.game.matter.bodies.polygon(this.boundary.x + 15 * inchesToGamePixels(1.5), this.boundary.y - inchesToGamePixels(1.75 / 2), 6, inchesToGamePixels(1.75)));
	/*
	this.body = this.game.matter.bodies.fromVertices(this.boundary.x, this.boundary.y, [
		this.vertices
	], {
		isStatic: true,
		inertia: 1e9,
	});
	*/
	this.body = this.game.matter.body.create({
		parts: this.bodies,
		isStatic: true,
		inertia: 1e9
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
	return {
		x: inchesToGamePixels(x),
		y: GameDimensions[1] - inchesToGamePixels(y)
	}
}

Boundary.prototype.refreshBody = function() {}

Boundary.prototype.update = function() {}