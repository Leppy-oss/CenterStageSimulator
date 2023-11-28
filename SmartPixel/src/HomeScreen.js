import Phaser from 'phaser';
import Junction from './obj/Junction';
import Bobot from './obj/Bobot'
import { JunctionType } from './obj/JunctionType';
import Robot from './obj/Robot';
import Cone from './obj/Cone';
import randomWords from 'random-words'
import { inchesToGamePixels, Vector2 } from './utils';

export default class HomeScreen extends Phaser.Scene {
    FIELD_DIMENSION = GameDimensions[0] / 2;
    junctions = [];
    robots = [];

    constructor() {
        super('hello-world');
    }

    preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((GameDimensions[0] - PROGRESS_BAR_WIDTH) / 2, (GameDimensions[1] - PROGRESS_BAR_HEIGHT) / 2, PROGRESS_BAR_WIDTH, PROGRESS_BAR_HEIGHT);
        var width = GameDimensions[0];
        var height = GameDimensions[1];
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                color: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                color: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                color: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(Math.round(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((GameDimensions[0] - PROGRESS_BAR_WIDTH + PROGRESS_BAR_PADDING) / 2, (GameDimensions[1] - PROGRESS_BAR_HEIGHT + PROGRESS_BAR_PADDING) / 2, (PROGRESS_BAR_WIDTH - 2 * PROGRESS_BAR_HEIGHT) * value, PROGRESS_BAR_HEIGHT - PROGRESS_BAR_PADDING);
        });
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        this.load.on('complete', function () {
            console.log('Finished loading assets');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        this.load.image('logo', '/8565CL.png');
        this.load.image('sky', '/resources/background/season-2022-powerplay/field-2022-official.png');
        this.load.image('red', '/particles/red.png');
        this.load.image('blue', '/particles/blue.png');
        this.load.image('redlight', '/robots/RedLightRobot.png');
        this.load.image('bluelight', '/robots/BlueLightRobot.png');
        this.load.image('junction', '/junction.png');
        this.load.image('linearslide', '/linearSlide.png');
        this.load.image('redcone', './redcone.png');
        this.load.image('bluecone', './bluecone.png');
        for (let i = 0; i < 200; i++) this.load.image(randomWords(1)[0], '/8565CL.png');
    }

    create() {
        this.add.image(this.FIELD_DIMENSION, this.FIELD_DIMENSION, 'sky').setScale(2 * this.FIELD_DIMENSION / 2270, 2 * this.FIELD_DIMENSION / 2270).setAlpha(0.5);
        this.matter.world.setGravity(0, 0);
        this.matter.world.setBounds(0, 0, GameDimensions[0], GameDimensions[1]);
        this.junctions = [
            //y value -this.FIELD_DIMENSION * 2.0/3.0
            new Junction(-this.FIELD_DIMENSION * 2.0 / 3.0, -this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.GROUND, this),
            new Junction(-this.FIELD_DIMENSION / 3, -this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.LOW, this),
            new Junction(0.0, -this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.GROUND, this),
            new Junction(this.FIELD_DIMENSION / 3.0, -this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.LOW, this),
            new Junction(this.FIELD_DIMENSION * 2.0 / 3.0, -this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.GROUND, this),
            //y value -this.FIELD_DIMENSION/3.0
            new Junction(-this.FIELD_DIMENSION * 2.0 / 3.0, -this.FIELD_DIMENSION / 3.0, JunctionType.LOW, this),
            new Junction(-this.FIELD_DIMENSION / 3, -this.FIELD_DIMENSION / 3.0, JunctionType.MID, this),
            new Junction(0.0, -this.FIELD_DIMENSION / 3.0, JunctionType.HIGH, this, 1),
            new Junction(this.FIELD_DIMENSION / 3.0, -this.FIELD_DIMENSION / 3.0, JunctionType.MID, this),
            new Junction(this.FIELD_DIMENSION * 2.0 / 3.0, -this.FIELD_DIMENSION / 3.0, JunctionType.LOW, this),
            //y value 0.0
            new Junction(-this.FIELD_DIMENSION * 2.0 / 3.0, 0.0, JunctionType.GROUND, this),
            new Junction(-this.FIELD_DIMENSION / 3, 0.0, JunctionType.HIGH, this),
            new Junction(0.0, 0.0, JunctionType.GROUND, this),
            new Junction(this.FIELD_DIMENSION / 3.0, 0.0, JunctionType.HIGH, this),
            new Junction(this.FIELD_DIMENSION * 2.0 / 3.0, 0.0, JunctionType.GROUND, this),
            //y value this.FIELD_DIMENSION/3.0
            new Junction(-this.FIELD_DIMENSION * 2.0 / 3.0, this.FIELD_DIMENSION / 3.0, JunctionType.LOW, this),
            new Junction(-this.FIELD_DIMENSION / 3, this.FIELD_DIMENSION / 3.0, JunctionType.MID, this),
            new Junction(0.0, this.FIELD_DIMENSION / 3.0, JunctionType.HIGH, this),
            new Junction(this.FIELD_DIMENSION / 3.0, this.FIELD_DIMENSION / 3.0, JunctionType.MID, this),
            new Junction(this.FIELD_DIMENSION * 2.0 / 3.0, this.FIELD_DIMENSION / 3.0, JunctionType.LOW, this),
            //y value this.FIELD_DIMENSION * 2.0/3.0
            new Junction(-this.FIELD_DIMENSION * 2.0 / 3.0, this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.GROUND, this),
            new Junction(-this.FIELD_DIMENSION / 3, this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.LOW, this),
            new Junction(0.0, this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.GROUND, this),
            new Junction(this.FIELD_DIMENSION / 3.0, this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.LOW, this),
            new Junction(this.FIELD_DIMENSION * 2.0 / 3.0, this.FIELD_DIMENSION * 2.0 / 3.0, JunctionType.GROUND, this)
        ];
        this.junctions.forEach(junction => {
            junction.x += this.FIELD_DIMENSION;
            junction.y += this.FIELD_DIMENSION;
            junction.updateBody();
        });
        
        /* TODO: cycle out by next commit if not used
        const walls = this.matter.world.walls;
        walls.top.collisionFilter.category = CATEGORY_ENV;
        walls.top.collisionFilter.mask = [CATEGORY_ROBOT_1, CATEGORY_ROBOT_2, CATEGORY_ROBOT_3, CATEGORY_ROBOT_4];
        walls.bottom.collisionFilter.category = CATEGORY_ENV;
        walls.bottom.collisionFilter.mask = [CATEGORY_ROBOT_1, CATEGORY_ROBOT_2, CATEGORY_ROBOT_3, CATEGORY_ROBOT_4];
        walls.left.collisionFilter.category = CATEGORY_ENV;
        walls.left.collisionFilter.mask = [CATEGORY_ROBOT_1, CATEGORY_ROBOT_2, CATEGORY_ROBOT_3, CATEGORY_ROBOT_4];
        walls.right.collisionFilter.category = CATEGORY_ENV;
        walls.right.collisionFilter.mask = [CATEGORY_ROBOT_1, CATEGORY_ROBOT_2, CATEGORY_ROBOT_3, CATEGORY_ROBOT_4];
        */

        this.p1rotL = this.input.keyboard.addKey(82); // r
        this.p1rotR = this.input.keyboard.addKey(84); // t
        this.p1L = this.input.keyboard.addKey(65); // a
        this.p1R = this.input.keyboard.addKey(68); // d
        this.p1D = this.input.keyboard.addKey(83); // s
        this.p1U = this.input.keyboard.addKey(87); // w
        this.p1S = this.input.keyboard.addKey(89); // y

        this.p2rotL = this.input.keyboard.addKey(188); // comma
        this.p2rotR = this.input.keyboard.addKey(190); // period
        this.p2L = this.input.keyboard.addKey(37); // left
        this.p2R = this.input.keyboard.addKey(39); // right
        this.p2D = this.input.keyboard.addKey(40); // down
        this.p2U = this.input.keyboard.addKey(38); // up
        this.p2S = this.input.keyboard.addKey(191); // slash

        this.p3rotL = this.input.keyboard.addKey(90); // z 
        this.p3rotR = this.input.keyboard.addKey(88); // x
        this.p3L = this.input.keyboard.addKey(67); // c
        this.p3R = this.input.keyboard.addKey(66); // b
        this.p3D = this.input.keyboard.addKey(86); // v
        this.p3U = this.input.keyboard.addKey(71); // g
        this.p3S = this.input.keyboard.addKey(16); // shift

        this.p4rotL = this.input.keyboard.addKey(73); // i
        this.p4rotR = this.input.keyboard.addKey(79); // o
        this.p4L = this.input.keyboard.addKey(72); // h
        this.p4R = this.input.keyboard.addKey(75); // k
        this.p4D = this.input.keyboard.addKey(74); // j
        this.p4U = this.input.keyboard.addKey(85); // u
        this.p4S = this.input.keyboard.addKey(80); // p

        this.spawnKey = this.input.keyboard.addKey(32); // space

        this.robots = [
            new Robot(0, this, "BLUE", this.p1L, this.p1R, this.p1D, this.p1U, this.p1rotL, this.p1rotR, this.p1S, 0, this.FIELD_DIMENSION / 2, this.FIELD_DIMENSION / 6, -Math.PI / 2),
            new Robot(1, this, "RED", this.p2L, this.p2R, this.p2D, this.p2U, this.p2rotL, this.p2rotR, this.p2S, 0, this.FIELD_DIMENSION / 2, 11 * this.FIELD_DIMENSION / 6, 0),
            new Robot(2, this, "BLUE", this.p3L, this.p3R, this.p3D, this.p3U, this.p3rotL, this.p3rotR, this.p3S, 0, 3 * this.FIELD_DIMENSION / 2, this.FIELD_DIMENSION / 6, -Math.PI / 2),
            new Robot(3, this, "RED", this.p4L, this.p4R, this.p4D, this.p4U, this.p4rotL, this.p4rotR, this.p4S, 0, 3 * this.FIELD_DIMENSION / 2, 11 * this.FIELD_DIMENSION / 6, 0),
        ];

        const redParticles = this.add.particles('red');
        const blueParticles = this.add.particles('blue');

        // const logo = this.add.image(this.FIELD_DIMENSION, this.FIELD_DIMENSION / 3, 'logo').setScale(0.5, 0.5);

        this.robots.forEach(robot => {
            const emitter = (robot.alliance == 'BLUE' ? redParticles : blueParticles).createEmitter({
                speed: 50,
                scale: { start: 0.5, end: 0 },
                blendMode: 'ADD',
            });
            emitter.startFollow(robot.chassis);
        });

        // logo.setDepth(1);
    }

    update(time, delta) {
        this.robots.forEach(robtob => {
            robtob.update(time, delta);
            robtob.updateControls(time, delta);
        })

        if (this.input.keyboard.checkDown(this.spawnKey, 100)) new Cone(GameDimensions[0] / 2, inchesToGamePixels(12), 'BLUE', this);
        for (let i = 0; i < this.junctions.length; i++) this.junctions[i].update();
        // for (let i = 0; i < this.robots.length; i++) this.robots[i].update(time, delta);
    }
}

/** loading progress bar width in px */
export const PROGRESS_BAR_WIDTH = 320;
/** loading progress bar height in px */
export const PROGRESS_BAR_HEIGHT = 50;
/** loading progress bar padding in px */
export const PROGRESS_BAR_PADDING = 10;
export const GameDimensions = [600, 600];
/** diameter in inches of the cone */
export const CONE_DIAM = 4;
export const CATEGORY_ROBOT_1 = 0;
export const CATEGORY_ROBOT_2 = 1;
export const CATEGORY_ROBOT_3 = 2;
export const CATEGORY_ROBOT_4 = 3;
export const CATEGORY_ENV = 44;