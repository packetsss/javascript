import * as PIXI from "pixi.js";

export const getRectCenter = (rect) => {
    return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
    };
};

export class DrawRect extends PIXI.Sprite {
    constructor(color = 0x000000) {
        super(PIXI.Texture.WHITE);
        // this.anchor.set(0.5);
        this.alpha = 0.2;
        this.tint = color;
        this.name = "rect";
    }

    update(x, y, width, height, visible = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.visible = visible;
    }
}
