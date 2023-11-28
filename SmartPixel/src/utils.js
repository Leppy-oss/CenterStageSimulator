import { GameDimensions } from "./HomeScreen";

/**
 * @param {any} inches Dimension in inches of the object
 * @returns The dimensions in pixels of the object as corresponding to the game/canvas
 */
export function inchesToGamePixels(inches) {
    return GameDimensions[0] / 144 * inches;
}

/**
 * Translates the x/y vector to a new one based on its heading and desired distance
 * @param {Number} distance - The distance to translate by
 * @param {Number} x - X coordinate of object
 * @param {Number} y - Y coordinate of object
 * @param {Number} heading - Heading to translate by, in RADIANS
 */
export function angledTranslation(distance, x, y, heading) {
    return [x + distance * Math.cos(heading), y + distance * Math.sin(heading)];
}

export const Vector2 = Phaser.Math.Vector2;