export class TextButton extends Phaser.GameObjects.Text {
	constructor(game, x, y, text, style, clickCallback, hoverCallback, exitHoverCallback = function() {}) {
		super(game, x, y, text, style);
		this.setStyle({
			font: '18px Lato'
		})
		this.game = game;

		this.setInteractive({ useHandCursor: true })
			.on('pointerover', () => {
				this.enterButtonHoverState();
				hoverCallback();
			})
			.on('pointerout', () => {
				this.enterButtonRestState()
				exitHoverCallback();
			})
			.on('pointerdown', () => this.enterButtonActiveState())
			.on('pointerup', () => {
				this.setStyle({ fill: '#ff0' });
				clickCallback();
			});
	}

	enterButtonHoverState() {
		this.game.sound.play('wow');
		this.setStyle({ fill: '#ff0' });
	}

	enterButtonRestState() {
		this.setStyle({ fill: '#0f0' });
	}

	enterButtonActiveState() {
		this.setStyle({ fill: '#0ff' });
	}
}