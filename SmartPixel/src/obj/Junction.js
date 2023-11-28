import { inchesToGamePixels } from "../utils";
import Cone from "./Cone";
import { JunctionType } from "./JunctionType";

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {(string | number)[]} type 
 * @param {Phaser.Scene} game 
 * @param {Number} cones The number of cones on this junction
 */
export default function Junction(x, y, type, game, cones=0) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.game = game;
    this.cones = cones;
    this.isRenderingCone = false;
    this.junction = this.game.matter.add.image(this.x, this.y, 'junction').setDisplaySize(inchesToGamePixels(this.type[0]) * 2, inchesToGamePixels(this.type[0]) * 2);
    this.updateBody();
}

Junction.prototype.updateBody = function() {
    this.body = this.game.matter.bodies.circle(this.x, this.y, inchesToGamePixels(this.type[0]), { isStatic: true });
    this.junction.setExistingBody(this.body);
    this.junction.setOrigin(0.5, 0.5);
}

Junction.prototype.update = function() {
    if (this.cones > 0 && !this.isRenderingCone) {
        let coneRendering = new Cone(this.junction.x, this.junction.y, 'BLUE', this.game, true);
        this.isRenderingCone = true;
    }
}