export default class Bobot {
    cones;
    x;
    y;
    width;
    height;
    phaserObject;
    slideObject;
    alliance;
    acc = 1000;
    friction = 250;
    speedCap = 200;
    mass = 100;

    constructor(cones, x, y, width, height, alliance) {
        this.cones = cones;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.alliance = alliance;
    }

    setPhaserObject(phaserObject) {
        this.phaserObject = phaserObject;
    }

    update(time, delta) {}
}