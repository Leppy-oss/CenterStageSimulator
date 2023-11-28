import { CATEGORY_ENV, CATEGORY_ROBOT_1, GameDimensions } from "../HomeScreen";
import { angledTranslation, inchesToGamePixels, Vector2 } from "../utils";

/**
 * 
 * @param {Number} index Z-index of the this
 * @param {Phaser.Scene} game The Phaser scene to build everything upon
 * @param {String} alliance Either "RED" or "BLUE" for the alliance of the this
 * @param {Number} acc The constant acceleration to apply to the this
 * @param {Phaser.Input.Keyboard.Key} left
 * @param {Phaser.Input.Keyboard.Key} right
 * @param {Phaser.Input.Keyboard.Key} down
 * @param {Phaser.Input.Keyboard.Key} up
 * @param {Phaser.Input.Keyboard.Key} rotL
 * @param {Phaser.Input.Keyboard.Key} rotR
 * @param {Phaser.Input.Keyboard.Key} slideOut
 * @param {Number} cones 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} theta
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} slideWidth 
 * @param {Number} slideHeight 
 * @param {Number} acc 
 * @param {Number} angularAcc
 * @param {Number} friction The static and dynamic friction of the this
 * @param {Number} speedCap Maximum velocity of the this
 * @param {Number} mass Mass of the this; used to calculate matter calculations and collision interactions
 */
export default function Robot(index, game, alliance, left, right, down, up, rotL, rotR, slideOut, cones = 0, x = GameDimensions[0] / 2, y = GameDimensions[1] / 2, theta=0, width = 14, height = 14, slideWidth = 52, slideHeight = 7, acc = 1000, angularAcc = 1.5, friction = 0.8, speedCap = 2000, mass = 200) {
    this.x = x;
    this.y = y;
    this.cones = cones;
    this.y;
    this.game = game;
    this.width = inchesToGamePixels(width);
    this.height = inchesToGamePixels(height);
    this.slideWidth = inchesToGamePixels(slideWidth);
    this.slideHeight = inchesToGamePixels(slideHeight);
    this.alliance = alliance;
    this.acc = acc;
    this.angularAcc = angularAcc;
    this.speedCap = speedCap;
    this.mass = mass;
    this.friction = friction;
    this.retractedPos = 10;
    this.slidePos = this.retractedPos;
    this.slideTargetPos = this.retractedPos;
    this.slideCollidingWithSomething = false;
    this.left = left;
    this.right = right;
    this.down = down;
    this.up = up;
    this.rotL = rotL;
    this.rotR = rotR;
    this.slideOut = slideOut;

    this.slide = this.game.add.image(this.x, this.y + 200, 'linearslide').setSize(this.slideWidth, this.slideHeight).setDisplaySize(this.slideWidth, this.slideHeight);
    this.chassis = this.game.matter.add.sprite(this.x, this.y, this.alliance == 'RED' ? 'redlight' : 'bluelight');
    this.chassis.setDepth(1e9);
    // this.chassis.setCollisionCategory(CATEGORY_ROBOT_1); // robtob
    // this.chassis.setCollidesWith([CATEGORY_ENV]); // environment

    this.chassis.setDisplaySize(this.width, this.height);
    this.chassis.setMass(this.mass);
    this.chassis.setFrictionAir(this.friction / 10);
    this.chassis.setFriction(this.friction);
    this.chassis.setFrictionStatic(this.friction);
    this.chassis.setRotation(theta);

    this.omega = 0; // ang vel
    this.omegaMax = this.speedCap / 100;
    this.alpha = 0; // ang acc

    this.slidePos = new Vector2(this.slidePos, 0).lerp(new Vector2(this.slideTargetPos, 0), 0.1).x;
    var prevRot = this.chassis.rotation;
    var chassisBody = this.game.matter.add.rectangle(this.chassis.x, this.chassis.y, this.width, this.height, { angle: prevRot });
    let tempCoords = angledTranslation(this.slidePos, this.chassis.x, this.chassis.y, prevRot - Math.PI / 2);
    var slideBody = this.game.matter.add.rectangle(tempCoords[0], tempCoords[1], this.slidePos * 2, this.slideHeight, { angle: prevRot - Math.PI / 2});
    slideBody.position.x = this.chassis.x;
    slideBody.position.y = this.chassis.y;

    var bodyFactory = this.game.matter.body;

    let compoundBody = bodyFactory.create({
        parts: [chassisBody, slideBody]
    });

    compoundBody.position = { x: this.chassis.x, y: this.chassis.y };
    compoundBody.angle = prevRot;
    this.game.matter.world.remove([chassisBody, slideBody]);

    this.chassis.setExistingBody(compoundBody);
};

Robot.prototype.updateControls = function(time, delta) {
    let angForce = 0;
    let tau = 0;
    if (this.rotL.isDown) tau -= this.angularAcc;
    if (this.rotR.isDown) tau += this.angularAcc;
    this.alpha = tau;
    let fx = 0;
    let fy = 0;
    if (this.left.isDown) fx--;
    if (this.right.isDown) fx++;
    if (this.down.isDown) fy++;
    if (this.up.isDown) fy--;
    this.chassis.applyForce(new Vector2(Math.cos(this.chassis.rotation), Math.sin(this.chassis.rotation)).scale(fx));
    this.chassis.applyForce(new Vector2(Math.cos(this.chassis.rotation + Math.PI / 2), Math.sin(this.chassis.rotation + Math.PI / 2)).scale(fy));
    if (this.slideOut.isDown) this.slideTargetPos = this.slideWidth / 2;
    else this.slideTargetPos = this.retractedPos;
}

Robot.prototype.update = function(time, delta) {
    // this.chassis.rotation += this.omega;
    // this.chassis.rotation += this.omega;
    let prevRot = this.chassis.rotation;
    this.slidePos = new Vector2(this.slidePos, 0).lerp(new Vector2(this.slideTargetPos, 0), 0.1).x;
    var chassisBody = this.game.matter.add.rectangle(this.chassis.x, this.chassis.y, this.width, this.height, { angle: prevRot });
    let tempCoords = angledTranslation(this.slidePos, this.chassis.x, this.chassis.y, prevRot - Math.PI / 2);
    var slideBody = this.game.matter.add.rectangle(tempCoords[0], tempCoords[1], this.slidePos * 2, this.slideHeight, { angle: prevRot - Math.PI / 2 });
    slideBody.position.x = this.chassis.x;
    slideBody.position.y = this.chassis.y;

    var bodyFactory = this.game.matter.body;

    let compoundBody = bodyFactory.create({
        parts: [chassisBody, slideBody]
    });

    compoundBody.position = { x: this.chassis.x, y: this.chassis.y };
    compoundBody.angle = prevRot;
    compoundBody.restitution = 0.1;
    this.game.matter.world.remove([chassisBody, slideBody]);

    // this.game.matter.body.applyForce(compoundBody, { x: 0, y: 0 }, { x: 0, y: this.alpha });
    // this.game.matter.body.setAngularVelocity(compoundBody, this.chassis..angularVelocity * (this.friction));

    this.chassis.setExistingBody(compoundBody);
    this.chassis.setOrigin(0.5, 0.5);
    this.chassis.setMass(this.mass);

    this.slide.setDisplaySize(this.slidePos * 2, this.slideHeight); // true argument updates the body size
    this.slide.setRotation(this.chassis.rotation - Math.PI / 2);
    this.slide.setPosition(tempCoords[0], tempCoords[1]);
    if (this.omega < this.omegaMax) this.omega += this.alpha * delta / 1000;
    this.omega *= this.friction;
    this.chassis.setAngularVelocity(this.omega);
};

Robot.prototype.setSlideTargetPosition = function(pos) {}