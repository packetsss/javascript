import * as PIXI from "pixi.js";
import { Body, Bodies } from "matter-js";

const drawRegularPolygon = (graphics, x, y, radius, sides, rotation = 0) => {
    sides = Math.max(sides | 0, 3);
    const startAngle = (-1 * Math.PI) / 2 + rotation;
    const delta = (Math.PI * 2) / sides;
    const polygon = [];

    for (let i = 0; i < sides; i++) {
        const angle = i * delta + startAngle;

        polygon.push(
            x + radius * Math.cos(angle),
            y + radius * Math.sin(angle)
        );
    }

    return graphics.drawPolygon(polygon);
};

export default class Particle extends PIXI.Graphics {
    constructor({
        x,
        y,
        color,
        canvas,
        engine,
        worldCenter,
        size = 5,
        shape = "circle",
        anchor = 0.5,
    }) {
        super();
        this.posX = x;
        this.posY = y;
        this.canvas = canvas;
        this.size = size;
        this.dirty = true
        this.worldCenter = worldCenter;
        // this.body = Bodies.circle(x, y, this.size);

        this.beginFill(parseInt(color.replace(/^#/, ""), 16)).lineStyle(0);
        switch (shape) {
            case "circle":
                this.drawCircle(this.posX, this.posY, this.size);
                break;
            case "triangle":
                drawRegularPolygon(this, this.posX, this.posY, this.size, 3, 0);
                break;
            case "rect":
                this.drawRect(
                    this.posX,
                    this.posY,
                    this.size * 1.5,
                    this.size * 1.5
                );
                break;
            case "pentagon":
                drawRegularPolygon(this, this.posX, this.posY, this.size, 5, 0);
                break;
            case "hexagon":
                drawRegularPolygon(this, this.posX, this.posY, this.size, 6, 0);
                break;
        }
        this.endFill();
    }

    remove() {
        this.canvas.removeChild(this);
    }

    updateBoundary(padding = 200) {
        const x = this.posX - this.size - padding + this.worldCenter.x;
        const y = this.posY - this.size - padding + this.worldCenter.y;
        const width = this.size * 2 + padding * 2;
        const height = this.size * 2 + padding * 2;
        return new PIXI.Rectangle(x, y, width, height);
        
    }
}
