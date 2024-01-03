import Phaser from 'phaser';
import { generate } from 'random-words'
import { inchesToGamePixels } from './utils';
import Pixel from './obj/Pixel';
import Boundary from './obj/boundary';
import { TextButton } from './obj/TextButton';

export default class HomeScreen extends Phaser.Scene {
	FIELD_DIMENSION = GameDimensions[0] / 2;

	pixels = [];
	colors = ['white', 'purple', 'green', 'yellow'];
	leftPixel;
	rightPixel;
	currColorLeft = 0;
	currColorRight = 0;
	mouseX = 0;
	mouseY = 0;
	hitSoundEnabled = true;
	hoveringButton = false;
	creatingPixel = false;
	leftPixelOffset = {
		x: -125,
		y: 0
	};
	rightPixelOffset = {
		x: 125,
		y: 0
	};
	modSpeed = 0.15;

	constructor() {
		super('test');
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
		this.load.image('white-pixel', './white-pixel.png');
		this.load.image('purple-pixel', './purple-pixel.png');
		this.load.image('green-pixel', './green-pixel.png');
		this.load.image('yellow-pixel', './yellow-pixel.png');
		this.load.image('red', '/particles/red.png');
		this.load.image('blue', '/particles/blue.png');
		this.load.audio('hit', './audio/hit.mp3');
		this.load.audio('wow', './audio/wow.wav');
		this.load.audio('bomb', './audio/bomb.mp3');
		this.load.audio('welcome', './audio/welcome.wav');
		this.load.audio('hitv3', './audio/bounce.mp3');
		for (let i = 0; i < 200; i++) this.load.image(generate(1)[0], '/8565CL.png');
	}

	createNewPixel(left) {
		return new Pixel(this.mouseX + this.rightPixelOffset.x * (left ? -1 : 1), this.mouseY, this.colors[left ? this.currColorLeft : this.currColorRight], this);
	}

	create() {
		// this.add.image(this.FIELD_DIMENSION, this.FIELD_DIMENSION, 'sky').setScale(2 * this.FIELD_DIMENSION / 2270, 2 * this.FIELD_DIMENSION / 2270).setAlpha(0.5);
		this.matter.world.setGravity(0, 4);
		this.matter.world.setBounds(0, 0, GameDimensions[0], GameDimensions[1]);
		this.matter.world.engine.positionIterations = 100;
		this.matter.world.engine.velocityIterations = 100;
		this.matter.world.engine.constraintIterations = 100;

		this.resetKey = this.input.keyboard.addKey(32); // space
		this.cycleKeyLeft = this.input.keyboard.addKey(37); // left arrow
		this.cycleKeyRight = this.input.keyboard.addKey(39); // left arrow
		this.hitKey = this.input.keyboard.addKey(82); // r

		this.leftKeyLeft = this.input.keyboard.addKey(65); // a
		this.rightKeyLeft = this.input.keyboard.addKey(68); // d
		this.upKeyLeft = this.input.keyboard.addKey(87); // w
		this.downKeyLeft = this.input.keyboard.addKey(83); // s

		this.leftKeyRight = this.input.keyboard.addKey(74); // j
		this.rightKeyRight = this.input.keyboard.addKey(76); // l
		this.upKeyRight = this.input.keyboard.addKey(73); //i
		this.downKeyRight = this.input.keyboard.addKey(75); // k

		this.add.image(GameDimensions[0] - 25, GameDimensions[1] / 2, 'logo').setScale(0.25, 0.25).setRotation(-Math.PI / 2);
		new Boundary(this);
		document.querySelector('canvas').addEventListener('mousemove', (e) => {
			this.mouseX = e.clientX - document.querySelector('canvas').getBoundingClientRect().left;
			this.mouseY = e.clientY - document.querySelector('canvas').getBoundingClientRect().top;
		});
		document.querySelector('canvas').addEventListener('mousedown', (e) => {
			if (!this.hoveringButton) {
				if (e.button == 0 && this.leftPixel != null) {
					this.leftPixel.drop();
					this.pixels.push(this.leftPixel);
					this.leftPixelOffset = {
						x: -125,
						y: 0
					};
					this.leftPixel = null;
				}
				else if (e.button == 2 && this.rightPixel != null) {
					this.rightPixel.drop();
					this.pixels.push(this.rightPixel);
					this.rightPixelOffset = {
						x: 125,
						y: 0
					};
					this.rightPixel = null;
				}
				if (this.leftPixel == null && this.rightPixel == null && !this.creatingPixel) {
					this.creatingPixel = true;
					setTimeout(() => {
						this.leftPixel = this.createNewPixel(true);
						this.rightPixel = this.createNewPixel(false);
						this.creatingPixel = false;
					}, 250);
				}
			}
		});
		document.addEventListener("contextmenu", function (e) {
			e.preventDefault();
		}, false);
		this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
			if (this.hitSoundEnabled) this.sound.play('hitv3');
		});
		this.sound.play('welcome');
		this.leftPixel = this.createNewPixel(true);
		this.rightPixel = this.createNewPixel(false);
		
		this.add.existing(new TextButton(this, GameDimensions[0] - 175, 25, 'Disable Hit Sound', { fill: '#0f0' }, () => this.hitSoundEnabled = !this.hitSoundEnabled, () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 25, 25, 'Reset', { fill: '#0f0' }, () => this.reset(), () => this.hoveringButton = true, () => this.hoveringButton = false));
		
		this.add.existing(new TextButton(this, 325, 50, 'White', { fill: '#0f0' }, () => this.changeRightColor(0), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 325, 75, 'Purple', { fill: '#0f0' }, () => this.changeRightColor(1), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 325, 100, 'Green', { fill: '#0f0' }, () => this.changeRightColor(2), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 325, 125, 'Yellow', { fill: '#0f0' }, () => this.changeRightColor(3), () => this.hoveringButton = true, () => this.hoveringButton = false));

		this.add.existing(new TextButton(this, 25, 50, 'White', { fill: '#0f0' }, () => this.changeLeftColor(0), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 25, 75, 'Purple', { fill: '#0f0' }, () => this.changeLeftColor(1), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 25, 100, 'Green', { fill: '#0f0' }, () => this.changeLeftColor(2), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 25, 125, 'Yellow', { fill: '#0f0' }, () => this.changeLeftColor(3), () => this.hoveringButton = true, () => this.hoveringButton = false));

		// logo.setDepth(1);
	}

	changeLeftColor(newColorIndex) {
		this.currColorLeft = newColorIndex;
		this.leftPixel.updateColor(this.colors[this.currColorLeft]);
	}

	changeRightColor(newColorIndex) {
		this.currColorRight = newColorIndex;
		this.rightPixel.updateColor(this.colors[this.currColorRight]);
	}

	reset() {
		this.pixels.forEach(pixel => {
			pixel.destroy();
		});
		this.pixels = [];
		this.changeLeftColor(0);
		this.changeRightColor(0);
	}

	update(time, delta) {
		this.pixels.forEach(pixel => {
			pixel.update(time, delta);
			pixel.updateBody(time, delta);
		});
		if (this.leftPixel != null) {
			this.leftPixel.update(time, delta);
			this.leftPixel.lockTo(this.mouseX + this.leftPixelOffset.x, this.mouseY + this.leftPixelOffset.y);
		}
		if (this.rightPixel != null) {
			this.rightPixel.update(time, delta);
			this.rightPixel.lockTo(this.mouseX + this.rightPixelOffset.x, this.mouseY + this.rightPixelOffset.y);
		}

		if (this.input.keyboard.checkDown(this.resetKey, 100)) this.reset();
		if (this.input.keyboard.checkDown(this.hitKey, 250)) {
			this.sound.play('bomb');
			this.pixels.forEach(pixel => {
				this.matter.body.applyForce(pixel.body, { x: 0, y: 0 }, { x: Math.random() * 0.01, y: Math.random() * 0.01 });
			});
		}
		if (this.input.keyboard.checkDown(this.leftKeyLeft)) this.leftPixelOffset.x -= this.modSpeed * delta
		if (this.input.keyboard.checkDown(this.rightKeyLeft)) {
			if (this.rightPixelOffset.x - this.leftPixelOffset.x > 70) this.leftPixelOffset.x += this.modSpeed * delta;
		}
		if (this.input.keyboard.checkDown(this.upKeyLeft)) this.leftPixelOffset.y -= this.modSpeed * delta
		if (this.input.keyboard.checkDown(this.downKeyLeft)) this.leftPixelOffset.y += this.modSpeed * delta
		if (this.input.keyboard.checkDown(this.leftKeyRight)) {
			if (this.rightPixelOffset.x - this.leftPixelOffset.x > 70) this.rightPixelOffset.x -= this.modSpeed * delta
		}
		if (this.input.keyboard.checkDown(this.rightKeyRight)) this.rightPixelOffset.x += this.modSpeed * delta
		if (this.input.keyboard.checkDown(this.upKeyRight)) this.rightPixelOffset.y -= this.modSpeed * delta
		if (this.input.keyboard.checkDown(this.downKeyRight)) this.rightPixelOffset.y += this.modSpeed * delta
		if (this.input.keyboard.checkDown(this.cycleKeyLeft, 250)) {
			if (this.currColorLeft < this.colors.length - 1) this.currColorLeft++;
			else this.currColorLeft = 0;
			this.leftPixel.updateColor(this.colors[this.currColorLeft]);
		}
		if (this.input.keyboard.checkDown(this.cycleKeyRight, 250)) {
			if (this.currColorRight < this.colors.length - 1) this.currColorRight++;
			else this.currColorRight = 0;
			this.rightPixel.updateColor(this.colors[this.currColorRight]);
		}
	}
}

/** loading progress bar width in px */
export const PROGRESS_BAR_WIDTH = 320;
/** loading progress bar height in px */
export const PROGRESS_BAR_HEIGHT = 50;
/** loading progress bar padding in px */
export const PROGRESS_BAR_PADDING = 10;
export const GameDimensions = [400, 602];
/** diameter in inches of the cone */
export const CONE_DIAM = 4;
export const CATEGORY_ROBOT_1 = 0;
export const CATEGORY_ROBOT_2 = 1;
export const CATEGORY_ROBOT_3 = 2;
export const CATEGORY_ROBOT_4 = 3;
export const CATEGORY_ENV = 44;