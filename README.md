# Center Stage Simulator
> Open-source simulator for the 2023-2024 CenterStage season of FTC (FIRST Tech Challenge), produced by FTC Team 8565 Technicbots.
> Try it out [here](https://center-stage-simulator.vercel.app)!

## Tech Stack
Built on:
<ul>
  <li>Vite</li>
  <li>Ably</li>
  <li>Phaser3</li>
  <li>Matter.js</li>
  <li>PostCSS</li>
</ul>

![License](https://img.shields.io/badge/license-MIT-green)

## Features
### Realistic Physics
Using Matter.js and hexagonal rigid bodies, this simulator perfectly replicates the bouncing behavior of pixels on the real CenterStage backdrop. You can even hit the backdrop like in real life to shake the pixels!

### Real-World Contraints
<ul>
  <li>Both pixels must be dropped before a new cycle can take place.</li>
  <li>The left and right pixels cannot be closer than a real-world design would allow.</li>
  <li>To simulate actual cycles, pixel colors cannot be changed after dropping the first pixel. Decide what pixels to place before dropping them!</li>
</ul>

### Advanced Features
<ul>
  <li>Magic wand to manipulate pixels</li>
  <li>Audio config</li>
  <li>Real-time score calculation and mosaic, connection visualization using graph theory</li>
</ul>

## Controls
<ul>
  <li>R: Reset all pixels</li>
  <li>SPACE: Hit/disturb the backdrop</li>
  <li>W/A/S/D: Manipulate the left pixel</li>
  <li>I/J/K/L: Manipulate the Right pixel</li>
  <li>LEFT/RIGHT CLICK: Drop the corresponding pixel</li>
  <li>LEFT/RIGHT ARROW: Cycles through colors for the corresponding pixel</li>
</ul>

## License
[MIT License](https://github.com/ourcade/phaser3-vite-template/blob/master/LICENSE)
