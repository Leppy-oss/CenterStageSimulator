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
	this.body = this.game.matter.bodies.polygon(this.x, this.y, 6, inchesToGamePixels(pixelWidth) / 2);
	this.particles = this.game.add.particles(0, 0, this.color, {
		speed: 50,
		scale: { start: 0.5, end: 0 },
		blendMode: 'MERGE',
	});
	this.pixel = this.game.matter.add.image(this.x, this.y, color.toLowerCase().concat('-pixel')).setDisplaySize(inchesToGamePixels(pixelHeight), inchesToGamePixels(pixelWidth));
	this.particles.startFollow(this.pixel);
	this.pixel.update();
	this.body.restitution = 0.5;
	this.body.friction = 0;
	this.body.density = 1;
	this.body.onCollideEndCallback = () => this.particles.stopAfter = 10;
	this.body.ignoreGravity = true;
	this.origInertia = this.body.inertia;
	this.body.inertia = 1e9;
	this.body.inverseInertia = 1 / this.body.inertia;
	this.body.collisionFilter = {
		group: -1,
		category: 2,
		mask: 0
	};
	// this.body.angle = Math.PI / 2;
	this.pixel.setExistingBody(this.body);
	this.pixel.setOrigin(0.5, 0.5);
	this.updateBody();
}

Pixel.prototype.updateColor = function(newColor) {
	this.pixel.setTexture(newColor.concat('-pixel'));
	this.particles.setTexture(newColor);
}

Pixel.prototype.updateBody = function() {}

Pixel.prototype.destroy = function() {
	this.game.matter.world.remove(this.body);
	this.pixel.destroy(true);
	this.particles.destroy();
}

Pixel.prototype.update = function() {
	this.updateBody();
	this.pixel.update();
	// if (Math.sqrt(Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.force.y, 2)) < 0.5) this.particles.setVisible(false);
	// else this.particles.setVisible(true);
}

Pixel.prototype.lockTo = function (x, y) {
	this.pixel.setPosition(x, y);
}

Pixel.prototype.drop = function() {
	this.body.ignoreGravity = false;
	this.body.inertia = this.origInertia;
	this.body.inverseInertia = 1 / this.origInertia;
	this.body.collisionFilter = {
		group: 1,
		category: 2,
		mask: 1
	};
}