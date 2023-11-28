import { CONE_DIAM } from "../HomeScreen";
import { inchesToGamePixels } from "../utils";

/**
 * @param {Number} x X-coord of the cone upon creation
 * @param {Number} y Y-coord of the cone upon creation
 * @param {String} color The color of the cone, either 'RED' or 'BLUE'
 * @param {Phaser.Scene} game The scene to create the cone in
 */
export default function Cone(x, y, color, game, shouldBeStatic=false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.game = game;
    this.body = this.game.matter.bodies.circle(this.x, this.y, inchesToGamePixels(CONE_DIAM) / 2, { angle: (Math.random() - 0.5) * 4 * Math.PI, isStatic: shouldBeStatic });
    this.cone = this.game.matter.add.image(this.x, this.y, this.color == 'RED' ? 'redcone' : 'bluecone').setDisplaySize(inchesToGamePixels(CONE_DIAM), inchesToGamePixels(CONE_DIAM));
    this.cone.rotation = this.body.angle;
    this.cone.setExistingBody(this.body);
    this.cone.setOrigin(0.5, 0.5);
}

Cone.prototype.refreshBody = function() {
    this.body = this.game.matter.bodies.circle(this.x, this.y, inchesToGamePixels(CONE_DIAM), { angle: this.cone.angle } );
    this.cone.rotation = this.body.angle;
    this.cone.setExistingBody(this.body);
    this.cone.setOrigin(0.5, 0.5);
}

Cone.prototype.update = function() {
    this.refreshBody();
}