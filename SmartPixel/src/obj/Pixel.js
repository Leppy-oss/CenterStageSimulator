import { inchesToGamePixels } from "../utils";

const pixelWidth = 3.5,
	pixelHeight = 3;

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
	this.pixel = this.game.matter.add.image(this.x, this.y, color.toLowerCase().concat('-pixel')).setDisplaySize(inchesToGamePixels(pixelHeight), inchesToGamePixels(pixelWidth));
	this.body = this.game.matter.bodies.polygon(this.x, this.y, 6, inchesToGamePixels(pixelWidth) / 2);
	this.pixel.update();
	this.body.restitution = 0.5;
	this.body.friction = 0;
	this.body.density = 1;
	// this.body.angle = Math.PI / 2;
	this.pixel.setExistingBody(this.body);
	this.pixel.setOrigin(0.5, 0.5);
	this.updateBody();
	console.log('Created new pixel');
}

Pixel.prototype.updateBody = function() {}

Pixel.prototype.update = function() {
	this.updateBody();
	this.pixel.update();
}