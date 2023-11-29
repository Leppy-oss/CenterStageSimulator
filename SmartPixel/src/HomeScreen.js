import Phaser from 'phaser';
import { generate } from 'random-words'
import { inchesToGamePixels, Vector2 } from './utils';
import Pixel from './obj/Pixel';

export default class HomeScreen extends Phaser.Scene {
	FIELD_DIMENSION = GameDimensions[0] / 2;

	pixels = []

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

		this.load.on('progress', function(value) {
			percentText.setText(Math.round(value * 100) + '%');
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect((GameDimensions[0] - PROGRESS_BAR_WIDTH + PROGRESS_BAR_PADDING) / 2, (GameDimensions[1] - PROGRESS_BAR_HEIGHT + PROGRESS_BAR_PADDING) / 2, (PROGRESS_BAR_WIDTH - 2 * PROGRESS_BAR_HEIGHT) * value, PROGRESS_BAR_HEIGHT - PROGRESS_BAR_PADDING);
		});
		this.load.on('fileprogress', function(file) {
			assetText.setText('Loading asset: ' + file.key);
		});
		this.load.on('complete', function() {
			console.log('Finished loading assets');
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
		});

		this.load.image('logo', '/8565CL.png');
		this.load.image('white-pixel', './white-pixel.png');
		this.load.image('purple-pixel', './purple-pixel.png');
		this.load.image('green-pixel', './green-pixel.png');
		this.load.image('yellow-pixel', './yello-pixel.png');
		this.load.image('red', '/particles/red.png');
		this.load.image('blue', '/particles/blue.png');
		for (let i = 0; i < 200; i++) this.load.image(generate(1)[0], '/8565CL.png');
	}

	create() {
		this.add.image(this.FIELD_DIMENSION, this.FIELD_DIMENSION, 'sky').setScale(2 * this.FIELD_DIMENSION / 2270, 2 * this.FIELD_DIMENSION / 2270).setAlpha(0.5);
		this.matter.world.setGravity(0, 0);
		this.matter.world.setBounds(0, 0, GameDimensions[0], GameDimensions[1]);

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

		this.spawnKey = this.input.keyboard.addKey(32); // space

		const redParticles = this.add.particles('red');
		const blueParticles = this.add.particles('blue');

		// const logo = this.add.image(this.FIELD_DIMENSION, this.FIELD_DIMENSION / 3, 'logo').setScale(0.5, 0.5);

		this.pixels.forEach(robot => {
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
		this.pixels.forEach(pixel => {
			pixel.update(time, delta);
			pixel.updateBody(time, delta);
		})

		if (this.input.keyboard.checkDown(this.spawnKey)) this.pixels.push(new Pixel(GameDimensions[0] / 2, inchesToGamePixels(12), 'BLUE', this));
	}
}

/** loading progress bar width in px */
export const PROGRESS_BAR_WIDTH = 320;
/** loading progress bar height in px */
export const PROGRESS_BAR_HEIGHT = 50;
/** loading progress bar padding in px */
export const PROGRESS_BAR_PADDING = 10;
export const GameDimensions = [400, 640];
/** diameter in inches of the cone */
export const CONE_DIAM = 4;
export const CATEGORY_ROBOT_1 = 0;
export const CATEGORY_ROBOT_2 = 1;
export const CATEGORY_ROBOT_3 = 2;
export const CATEGORY_ROBOT_4 = 3;
export const CATEGORY_ENV = 44;