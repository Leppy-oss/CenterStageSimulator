import { CONE_DIAM } from "../HomeScreen";
import { inchesToGamePixels } from "../utils";
import { GameDimensions } from "../HomeScreen";

/**
 * @param {Phaser.Scene} game The scene to create the cone in
 */
export default function Boundary(game) {
	this.game = game;
	this.boundary = this.game.matter.add.image(0, GameDimensions[1], 'white-pixel');
	this.body = this.game.matter.bodies.fromVertices(this.boundary.x, this.boundary.y, [
		[parseCoordinates(0, -2.13), parseCoordinates(10, 20), parseCoordinates(1, 4)],
	], {
		isStatic: true,
		inertia: 1e9
	});
	this.boundary.setExistingBody(this.body);
	this.boundary.setOrigin(0.5, 0.5);
}

/**
 * @param {Number} x 
 * @param {Number} y 
 * @returns Coordinates in object form
 */
const parseCoordinates = (x, y) => {
	return {
		'x': inchesToGamePixels(x),
		'y': GameDimensions[1] - inchesToGamePixels(y)
	}
}

Boundary.prototype.refreshBody = function() {}

Boundary.prototype.update = function() {}