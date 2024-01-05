/**
 *  _____  _____ _   _ _____ ___________  _____ _____ ___  _____  _____   _____ ________  ____   _ _       ___ _____ ___________ 
 * /  __ \|  ___| \ | |_   _|  ___| ___ \/  ___|_   _/ _ \|  __ \|  ___| /  ___|_   _|  \/  | | | | |     / _ \_   _|  _  | ___ \
 * | /  \/| |__ |  \| | | | | |__ | |_/ /\ `--.  | |/ /_\ \ |  \/| |__   \ `--.  | | | .  . | | | | |    / /_\ \| | | | | | |_/ /
 * | |    |  __|| . ` | | | |  __||    /  `--. \ | ||  _  | | __ |  __|   `--. \ | | | |\/| | | | | |    |  _  || | | | | |    / 
 * | \__/\| |___| |\  | | | | |___| |\ \ /\__/ / | || | | | |_\ \| |___  /\__/ /_| |_| |  | | |_| | |____| | | || | \ \_/ / |\ \ 
 * \____/\____/\_| \_/ \_/ \____/\_| \_|\____/  \_/\_| |_/\____/\____/  \____/ \___/\_|  |_/\___/\_____/\_| |_/\_/  \___/\_| \_|
 *                                                                                                                               
 *                                                                                                                            
 * ______              _     _____         _           _      _           _         _____  _____  ____  _____                    
 * | ___ \            | |   |_   _|       | |         (_)    | |         | |       |  _  ||  ___|/ ___||  ___|                   
 * | |_/ / __ ___   __| |     | | ___  ___| |__  _ __  _  ___| |__   ___ | |_ ___   \ V / |___ \/ /___ |___ \                    
 * |  __/ '__/ _ \ / _` |     | |/ _ \/ __| '_ \| '_ \| |/ __| '_ \ / _ \| __/ __|  / _ \     \ \ ___ \    \ \                   
 * | |  | | | (_) | (_| |_    | |  __/ (__| | | | | | | | (__| |_) | (_) | |_\__ \ | |_| |/\__/ / \_/ |/\__/ /                   
 * \_|  |_|  \___/ \__,_(_)   \_/\___|\___|_| |_|_| |_|_|\___|_.__/ \___/ \__|___/ \_____/\____/\_____/\____/                    
 *                                                                                                                           
 *                                                                                                                            
 *  _____  _____  _____   ___                                                                                                    
 * / __  \|  _  |/ __  \ /   |                                                                                                   
 * `' / /'| |/' |`' / /'/ /| |                                                                                                   
 *   / /  |  /| |  / / / /_| |                                                                                                   
 * ./ /___\ |_/ /./ /__\___  |                                                                                                   
 * \_____/ \___/ \_____/   |_/                                                                                                                         
 */

import Phaser from 'phaser';
import { generate } from 'random-words'
import Pixel from './obj/Pixel';
import Boundary from './obj/boundary';
import { TextButton } from './obj/TextButton';
import { checkScore } from './score-checker';
import { numberToColorHsl } from './utils';
import MagicWand from './obj/MagicWand';

export default class HomeScreen extends Phaser.Scene {
	FIELD_DIMENSION = GameDimensions[0] / 2;

	/**
	 * @type {Array<Pixel>}
	 */
	pixels = [];
	colors = ['white', 'purple', 'green', 'yellow'];
	/**
	 * @type {Pixel}
	 */
	leftPixel;
	/**
	 * @type {Pixel}
	 */
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
	hitSoundBtn;
	magicWandBtn;
	/**
	 * @type {MagicWand}
	 */
	magicWand;

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
		this.load.image('backdrop', '/backdrop.png');
		for (const color of this.colors) this.load.image(color, './particles/'.concat(color).concat('.png'));
		for (const color of this.colors) this.load.image(color.concat('-pixel'), './'.concat(color).concat('-pixel.png'));
		this.load.image('magic-wand', './magic-wand.png');

		this.load.audio('hit', './audio/hit.mp3');
		this.load.audio('wow', './audio/wow.wav');
		this.load.audio('bomb', './audio/bomb.mp3');
		this.load.audio('welcome', './audio/welcome.wav');
		this.load.audio('hitv3', './audio/bounce.mp3');
		this.load.audio('change-color', './audio/change-color.wav');
		this.load.audio('change-color-failed', './audio/change-color-failed.wav');
		this.load.audio('reset', './audio/reset.wav');
		this.load.audio('toggle', './audio/toggle.wav');

		// feke-gen
		for (let i = 0; i < 30; i++) this.load.image(generate(1)[0], '/8565CL.png');
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

		this.resetKey = this.input.keyboard.addKey(82); // r
		this.hitKey = this.input.keyboard.addKey(32); // space
		this.cycleKeyLeft = this.input.keyboard.addKey(37); // left arrow
		this.cycleKeyRight = this.input.keyboard.addKey(39); // left arrow

		this.leftKeyLeft = this.input.keyboard.addKey(65); // a
		this.rightKeyLeft = this.input.keyboard.addKey(68); // d
		this.upKeyLeft = this.input.keyboard.addKey(87); // w
		this.downKeyLeft = this.input.keyboard.addKey(83); // s

		this.leftKeyRight = this.input.keyboard.addKey(74); // j
		this.rightKeyRight = this.input.keyboard.addKey(76); // l
		this.upKeyRight = this.input.keyboard.addKey(73); //i
		this.downKeyRight = this.input.keyboard.addKey(75); // k
		
		this.wandKey = this.input.keyboard.addKey(38); // up arrow

		this.add.image(GameDimensions[0] / 2, GameDimensions[1] / 2, 'backdrop').setDisplaySize(GameDimensions[0], GameDimensions[1]);
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
					this.leftPixel.setPixelId(this.pixels.length);
					this.pixels.push(this.leftPixel);
					this.leftPixelOffset = {
						x: -125,
						y: 0
					};
					this.leftPixel = null;
				} else if (e.button == 2 && this.rightPixel != null) {
					this.rightPixel.drop();
					this.rightPixel.setPixelId(this.pixels.length);
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
		this.matter.world.on('collisionend', (event, bodyA, bodyB) => {
			this.calcScore();
			if (this.hitSoundEnabled) this.sound.play('hitv3');
		});
		this.sound.play('welcome');
		this.leftPixel = this.createNewPixel(true);
		this.rightPixel = this.createNewPixel(false);
		this.magicWand = new MagicWand(this.mouseX, this.mouseY, this);

		const minTextY = 15;
		const textYGap = 20;

		this.hitSoundBtn = new TextButton(this, 225, minTextY, 'Disable Bounce Sound', { fill: '#0f0' }, () => {
			this.hitSoundEnabled = !this.hitSoundEnabled;
			this.changeHitSoundBtnText();
		}, () => this.hoveringButton = true, () => this.hoveringButton = false);
		this.add.existing(this.hitSoundBtn);

		this.add.existing(new TextButton(this, 25, minTextY, 'Reset', { fill: '#0f0' }, () => this.reset(), () => this.hoveringButton = true, () => this.hoveringButton = false));

		this.add.existing(new TextButton(this, 325, minTextY + textYGap, 'White', { fill: '#0f0' }, () => this.changeRightColor(0), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 325, minTextY + 2 * textYGap, 'Purple', { fill: '#0f0' }, () => this.changeRightColor(1), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 325, minTextY + 3 * textYGap, 'Green', { fill: '#0f0' }, () => this.changeRightColor(2), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 325, minTextY + 4 * textYGap, 'Yellow', { fill: '#0f0' }, () => this.changeRightColor(3), () => this.hoveringButton = true, () => this.hoveringButton = false));

		this.add.existing(new TextButton(this, 25, minTextY + textYGap, 'White', { fill: '#0f0' }, () => this.changeLeftColor(0), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 25, minTextY + 2 * textYGap, 'Purple', { fill: '#0f0' }, () => this.changeLeftColor(1), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 25, minTextY + 3 * textYGap, 'Green', { fill: '#0f0' }, () => this.changeLeftColor(2), () => this.hoveringButton = true, () => this.hoveringButton = false));
		this.add.existing(new TextButton(this, 25, minTextY + 4 * textYGap, 'Yellow', { fill: '#0f0' }, () => this.changeLeftColor(3), () => this.hoveringButton = true, () => this.hoveringButton = false));

		this.magicWandBtn = new TextButton(this, 25, minTextY + 5 * textYGap, 'Enable Magic Wand', { fill: '#0f0' }, () => this.toggleMagicWandBtn(), () => this.hoveringButton = true, () => this.hoveringButton = false);
		this.add.existing(this.magicWandBtn);
	}

	calcScore() {
		const scoreBreakdown = checkScore(this.pixels);
		document.getElementById('num-pixels-text').innerHTML = scoreBreakdown.npixels.toString();
		document.getElementById('num-pixels-text').style.color = numberToColorHsl(scoreBreakdown.npixels, 5, 10);
		document.getElementById('num-mosaics-text').innerHTML = scoreBreakdown.nmosaics.toString();
		document.getElementById('num-mosaics-text').style.color = numberToColorHsl(scoreBreakdown.nmosaics, 0.1, 4);
		document.getElementById('num-lines-text').innerHTML = scoreBreakdown.nlines.toString();
		document.getElementById('num-lines-text').style.color = numberToColorHsl(scoreBreakdown.nlines, 0.1, 2);
		document.getElementById('total-score-text').innerHTML = (3 * scoreBreakdown.npixels + 10 * (scoreBreakdown.nmosaics + scoreBreakdown.nlines)).toString();
		document.getElementById('total-score-text').style.color = numberToColorHsl(3 * scoreBreakdown.npixels + 10 * (scoreBreakdown.nmosaics + scoreBreakdown.nlines), 20, 60);
	}

	changeHitSoundBtnText() {
		if (this.hitSoundEnabled) this.hitSoundBtn.text = 'Disable Bounce Sound';
		else this.hitSoundBtn.text = 'Enable Bounce Sound';
		this.sound.play('toggle');
	}

	toggleMagicWandBtn() {
		this.magicWand.toggle();
		if (this.magicWand.magicWand.visible) this.magicWandBtn.text = 'Disable Magic Wand';
		else this.magicWandBtn.text = 'Enable Magic Wand';
		this.sound.play('toggle');
	}

	changeLeftColor(newColorIndex, playSound = true) {
		this.currColorLeft = newColorIndex;
		if (this.leftPixel != null && this.rightPixel != null) {
			this.leftPixel.updateColor(this.colors[this.currColorLeft]);
			if (playSound) this.sound.play('change-color');
		} else if (playSound) this.sound.play('change-color-failed');
	}

	changeRightColor(newColorIndex, playSound = true) {
		this.currColorRight = newColorIndex;
		if (this.leftPixel != null && this.rightPixel != null) {
			this.rightPixel.updateColor(this.colors[this.currColorRight]);
			if (playSound) this.sound.play('change-color');
		} else if (playSound) this.sound.play('change-color-failed');
	}

	reset() {
		this.pixels.forEach(pixel => {
			pixel.destroy();
		});
		this.changeLeftColor(0, false);
		this.changeRightColor(0, false);
		if (this.leftPixel != null) this.leftPixel.destroy();
		if (this.rightPixel != null) this.rightPixel.destroy();
		this.leftPixel = this.createNewPixel(true);
		this.rightPixel = this.createNewPixel(false);
		this.sound.play('reset');
		this.calcScore();
	}

	update(time, delta) {
		this.pixels.forEach(pixel => {
			if (!pixel.alive) {
				this.pixels.splice(this.pixels.indexOf(pixel), 1);
				this.calcScore();
			}
			else {
				pixel.update();
				pixel.updateBody();
			}
		});
		if (this.leftPixel != null) {
			this.leftPixel.update();
			this.leftPixel.lockTo(this.mouseX + this.leftPixelOffset.x, this.mouseY + this.leftPixelOffset.y);
		}
		if (this.rightPixel != null) {
			this.rightPixel.update();
			this.rightPixel.lockTo(this.mouseX + this.rightPixelOffset.x, this.mouseY + this.rightPixelOffset.y);
			this.magicWand.lockTo(this.mouseX, this.mouseY);
		}

		if (this.input.keyboard.checkDown(this.resetKey, 1000)) this.reset();
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
		if (this.leftPixel != null && this.rightPixel != null) {
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
		if (this.input.keyboard.checkDown(this.wandKey, 1000)) this.magicWand.toggle();
	}
}

/** loading progress bar width in px */
export const PROGRESS_BAR_WIDTH = 320;
/** loading progress bar height in px */
export const PROGRESS_BAR_HEIGHT = 50;
/** loading progress bar padding in px */
export const PROGRESS_BAR_PADDING = 10;
export const GameDimensions = [400, 602];