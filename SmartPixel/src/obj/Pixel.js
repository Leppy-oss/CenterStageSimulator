import { inchesToGamePixels } from "../utils";

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} color 
 * @param {Phaser.Scene} game 
 */
export default function Pixel(x, y, color, game) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.game = game;
	this.pixel = this.game.matter.add.image(this.x, this.y, 'white-pixel').setDisplaySize(inchesToGamePixels(this.color[0]) * 2, inchesToGamePixels(this.color[0]) * 2);
	this.updateBody();
}

Pixel.prototype.updateBody = function() {
	this.body = this.game.matter.bodies.circle(this.x, this.y, inchesToGamePixels(10), { isStatic: true });
	this.pixel.setExistingBody(this.body);
	this.pixel.setOrigin(0.5, 0.5);
	console.log('Created new pixel');
}

Pixel.prototype.update = function() {}