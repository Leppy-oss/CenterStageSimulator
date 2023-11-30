import { CONE_DIAM } from "../HomeScreen";
import { inchesToGamePixels } from "../utils";
import { GameDimensions } from "../HomeScreen";

/**
 * @param {Phaser.Scene} game The scene to create the cone in
 */
export default function Boundary(game) {
	this.game = game;
	this.boundary = this.game.matter.add.image(GameDimensions[0] / 2, GameDimensions[1] - 50, 'white-pixel');
	this.body = this.game.matter.bodies.fromVertices(this.boundary.x, this.boundary.y, [
		[{ "x": 150, "y": 45 }, { "x": 134, "y": 0 }, { "x": 18, "y": 30 }, { "x": 1, "y": 56 }, { "x": 21, "y": 94 }, { "x": 86, "y": 76 }],
		[{ "x": 43, "y": 17 }, { "x": 44, "y": 23 }, { "x": 59, "y": 19 }, { "x": 58, "y": 14 }],
		[{ "x": 6, "y": 41 }, { "x": 1, "y": 56 }, { "x": 18, "y": 30 }],
		[{ "x": 6, "y": 83 }, { "x": 21, "y": 94 }, { "x": 1, "y": 56 }, { "x": 2, "y": 72 }],
		[{ "x": 86, "y": 76 }, { "x": 21, "y": 94 }, { "x": 25, "y": 108 }, { "x": 48, "y": 124 }, { "x": 61, "y": 124 }, { "x": 73, "y": 119 }, { "x": 83, "y": 109 }, { "x": 88, "y": 95 }],
		[{ "x": 34, "y": 118 }, { "x": 48, "y": 124 }, { "x": 25, "y": 108 }]
	]);
	this.boundary.setExistingBody(this.body);
	this.boundary.setOrigin(0.5, 0.5);
}

Boundary.prototype.refreshBody = function() {}

Boundary.prototype.update = function() {}