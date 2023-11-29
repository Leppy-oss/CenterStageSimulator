import { CONE_DIAM } from "../HomeScreen";
import { inchesToGamePixels } from "../utils";

/**
 * @param {Phaser.Scene} game The scene to create the cone in
 */
export default function Boundary(game) {
	this.game = game;
	this.game.matter.add.fromVertices(
		0, 0, [
			[0, 0],
			[200, 200]
		]
	);
}

Boundary.prototype.refreshBody = function() {}

Boundary.prototype.update = function() {}