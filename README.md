# Center Stage Simulator
> Open-source simulator for the 2023-2024 CenterStage season of FTC (FIRST Tech Challenge), produced by FTC Team 8565 Technicbots.
> Try it out [here](https://link-url-here.org](https://center-stage-simulator.vercel.app/)!

## Tech Stack
Built on:
> Phaser.js
> Matter.js
> Vite.js
> Ably
> PostCSS

![License](https://img.shields.io/badge/license-MIT-green)

## Features
### Realistic Physics
Using Matter.js and hexagonal rigid bodies, this simulator perfectly replicates the bouncing behavior of pixels on the real CenterStage backdrop. You can even hit the backdrop like in real life to shake the pixels!

### Real-World Contraints
> Both pixels must be dropped before a new cycle can take place.
> The left and right pixels cannot be closer than a real-world claw/drillbit design would allow
> To simulate actual cycles, pixel colors cannot be changed after dropping the first pixel. Decide what pixels to place before dropping them!

### Advanced Features
> Magic wand to manipulate pixels
> Audio config
> Score breakdown and "connectedness" visualization using graph theory

## Controls
> R: Reset all pixels
> SPACE: Hit/disturb the backdrop
> W/A/S/D: Manipulate the left pixel
> I/J/K/L: Manipulate the Right pixel
> LEFT/RIGHT CLICK: Drop the corresponding pixel
> LEFT/RIGHT ARROW: Cycles through colors for the corresponding pixel

## License
[MIT License](https://github.com/ourcade/phaser3-vite-template/blob/master/LICENSE)
