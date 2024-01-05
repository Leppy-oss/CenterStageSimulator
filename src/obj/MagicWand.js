import { GameDimensions } from "../HomeScreen";
import { inchesToGamePixels } from "../utils";

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Phaser.Scene} game 
 */
export default function MagicWand(x, y, game) {
    this.x = x;
    this.y = y;
    this.game = game;
    this.body = this.game.matter.bodies.circle(0, 0, 10);
    this.magicWand = this.game.matter.add.image(this.x, this.y, 'magic-wand').setScale(0.25).toggleFlipX();
    this.particles = this.game.add.particles(0, 0, 'yellow', {
        speed: 50,
        maxAliveParticles: 10,
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
    }).startFollow(this.magicWand);
    this.body.restitution = 0.5;
    this.body.friction = 0;
    this.body.density = 1;
    this.body.ignoreGravity = true;
    this.body.inertia = 1e9;
    this.body.isStatic = true;
    this.body.inverseInertia = 1 / this.body.inertia;
    // this.body.angle = Math.PI / 2;
    this.magicWand.setExistingBody(this.body);
    this.magicWand.setOrigin(0.3, 0.3);
    this.toggle();
}

MagicWand.prototype.updateBody = function () { }

MagicWand.prototype.toggle = function () {
    if (this.magicWand.visible) {
        this.magicWand.setVisible(false);
        this.particles.setVisible(false);
        this.body.collisionFilter = {
            group: -1,
            category: 2,
            mask: 0
        };
    }
    else {
        this.magicWand.setVisible(true);
        this.particles.setVisible(true);
        this.body.collisionFilter = {
            group: 1,
            category: 2,
            mask: 1
        };
    }
}

MagicWand.prototype.update = function () {
    this.updateBody();
    this.magicWand.update();
}

MagicWand.prototype.lockTo = function (x, y) {
    this.magicWand.setPosition(x, y);
}