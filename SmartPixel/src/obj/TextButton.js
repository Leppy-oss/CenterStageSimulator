export class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, clickCallback, hoverCallback, exitHoverCallback = function() {}) {
        super(scene, x, y, text, style);

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
                this.enterButtonHoverState();
                clickCallback();
            });
    }

    enterButtonHoverState() {
        this.setStyle({ fill: '#ff0' });
    }

    enterButtonRestState() {
        this.setStyle({ fill: '#0f0' });
    }

    enterButtonActiveState() {
        this.setStyle({ fill: '#0ff' });
    }
}