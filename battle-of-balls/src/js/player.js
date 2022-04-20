import * as PIXI from "pixi.js";
// import { Matter } from "matter-js";
import { Body, Bodies, Composite, Vector } from "matter-js";

import { getRectCenter } from "./utils.js";

// const Body = Matter.Body;
// const Bodies = Matter.Bodies;
// const Vector = Matter.Vector;

export class Cell extends PIXI.Sprite {
    constructor({
        x,
        y,
        app,
        engine,
        size,
        initialSplitSize,
        velocity,
        splitVelocity,
        viewpointCenter,
    }) {
        const graphics = new PIXI.Graphics()
            .clear()
            .beginFill(0xffffff)
            .lineStyle(0)
            .drawCircle(x, y, size)
            .endFill();
        super(app.renderer.generateTexture(graphics));

        this.x = x;
        this.y = y;
        this.app = app;
        this.engine = engine;
        this.size = size;
        this.dirty = false;
        this.initialSplitSize = initialSplitSize;
        this.sizeMultiplier = 2; // 0.2
        this.speedMultiplier = 0.13;
        this.width = this.height = this.size * 2;
        this.velocity = velocity;
        this.splitVelocity = splitVelocity;
        this.speed =
            ((this.initialSplitSize * 50) / this.size) * this.speedMultiplier;
        this.gravityVelocity = { x: 0, y: 0 };
        this.viewpointCenter = viewpointCenter;
        this.graphics = graphics;
        this.anchor.set(0.5);

        this._addBody(false);
        this._updateGravitySpeed();
        this.updateBoundary();
    }

    updatePosition() {
        this.x = this.body.position.x;
        this.y = this.body.position.y;
    }

    updateBoundary(padding = 0) {
        const x = this.x - this.size - padding;
        const y = this.y - this.size - padding;
        const width = this.size * 2 + padding * 2;
        const height = this.size * 2 + padding * 2;
        this.visibleBoundary = new PIXI.Rectangle(x, y, width, height);
        return this.visibleBoundary;
    }

    updateSpeed(velocity, viewpointCenter) {
        this.viewpointCenter = viewpointCenter;
        this.speed =
            ((this.initialSplitSize * 3) / Math.sqrt(this.size)) *
            this.speedMultiplier;

        this.velocity.x = velocity.x * this.speed;
        this.velocity.y = velocity.y * this.speed;
        // this.x +=
        //     this.velocity.x + this.splitVelocity.x + this.gravityVelocity.x;
        // this.y -=
        //     this.velocity.y + this.splitVelocity.y - this.gravityVelocity.y;

        Body.setVelocity(this.body, {
            x: this.velocity.x + this.gravityVelocity.x + this.splitVelocity.x,
            y: -this.velocity.y + this.gravityVelocity.y - this.splitVelocity.y,
        });

        this._decreaseSplitSpeed();
        this._updateGravitySpeed();
    }

    splitSize() {
        this.size /= 2;
        this.width = this.height = this.size * 2;
        this._addBody();
    }

    updateSize(size) {
        const scale = (this.size + size * this.sizeMultiplier) / this.size;
        this.size *= scale;
        this.width = this.height = this.size * 2;
        this._addBody();
    }

    _addBody(remove = true) {
        if (remove) {
            Composite.remove(this.engine.world, this.body);
        }
        this.body = Bodies.circle(this.x, this.y, this.size, {
            restitution: 1,
            friction: 1,
            frictionAir: 0,
        });
        // Body.setMass(this.body, this.size ** 1);
        // Body.setDensity(this.body, 0.1);
        // Body.setInertia(this.body, Infinity);
        Composite.add(this.engine.world, this.body);
    }

    _decreaseSplitSpeed() {
        const speedDecrease = 7;
        if (this.splitVelocity.x - speedDecrease > 0) {
            this.splitVelocity.x -= speedDecrease;
        } else if (this.splitVelocity.x + speedDecrease < 0) {
            this.splitVelocity.x += speedDecrease;
        } else {
            this.splitVelocity.x = 0;
        }
        if (this.splitVelocity.y - speedDecrease > 0) {
            this.splitVelocity.y -= speedDecrease;
        } else if (this.splitVelocity.y + speedDecrease < 0) {
            this.splitVelocity.y += speedDecrease;
        } else {
            this.splitVelocity.y = 0;
        }
    }

    _updateGravitySpeed() {
        const cellToCenterDist = Math.sqrt(
            (this.viewpointCenter.x - this.x) ** 2 +
                (this.viewpointCenter.y - this.y) ** 2
        );

        if (cellToCenterDist === 0) {
            this.gravityVelocity.x = 0;
            this.gravityVelocity.y = 0;
        } else {
            this.gravityVelocity.x =
                ((this.viewpointCenter.x - this.x) /
                    cellToCenterDist /
                    (this.velocity.x === 0
                        ? 1
                        : Math.max(0.5, Math.abs(this.velocity.x)))) *
                5;
            this.gravityVelocity.y =
                ((this.viewpointCenter.y - this.y) /
                    cellToCenterDist /
                    (this.velocity.y === 0
                        ? 1
                        : Math.max(0.5, Math.abs(this.velocity.y)))) *
                5;
        }
    }
}

export class Player {
    constructor({
        x,
        y,
        app,
        engine,
        worldCenter,
        size = 110,
        initialSplitSize = 220,
    }) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.size = size;
        this.engine = engine;
        this.initialSplitSize = initialSplitSize;
        this.speed;
        this.boundaryMultiplier = 120;
        this.zoomMultiplier = 30;
        this.worldCenter = worldCenter;
        this.cells = [
            new Cell({
                x: this.x,
                y: this.y,
                app: this.app,
                engine: this.engine,
                size: this.size,
                initialSplitSize: this.initialSplitSize,
                velocity: { x: 0, y: 0 },
                splitVelocity: { x: 0, y: 0 },
                viewpointCenter: { x: this.x, y: this.y },
            }),
        ];

        this.splits = 1;
        this.splitDirection = { x: -1, y: 0 };

        this.updateSpeed();
        this.updateBoundary();
    }

    split() {
        const newCells = [];
        if (this.cells.length < 16) {
            this.cells.forEach((cell) => {
                if (
                    cell.size > this.initialSplitSize &&
                    this.cells.length < 16
                ) {
                    this.splits += 1;
                    cell.splitSize();
                    const splitVelocity = (direction) =>
                        120 * direction + cell.size ** 0.65 * direction;
                    const newCell = new Cell({
                        x: cell.x,
                        y: cell.y,
                        app: this.app,
                        engine: this.engine,
                        size: cell.size,
                        initialSplitSize: this.initialSplitSize,
                        velocity: {
                            x: cell.velocity.x * this.splitDirection.x,
                            y: cell.velocity.y * this.splitDirection.y,
                        },
                        splitVelocity: {
                            x: splitVelocity(this.splitDirection.x),
                            y: splitVelocity(this.splitDirection.y),
                        },
                        viewpointCenter: { x: this.x, y: this.y },
                    });
                    this.cells.push(newCell);
                    newCells.push(newCell);
                }
            });
        }
        return newCells;
    }

    updatePosition(velocity) {
        // update viewpoint
        const center = getRectCenter(this.visibleBoundary);
        center.x += velocity.x * this.speed;
        center.y -= velocity.y * this.speed;
        this.x = center.x;
        this.y = center.y;

        // update each cell
        this.cells.forEach((cell) => {
            cell.updateSpeed(velocity, center);
        });
    }

    updateCellsPosition() {
        this.cells.forEach((cell) => {
            cell.updatePosition();
        });
    }

    updateSpeed() {
        this.speed =
            this.cells.reduce((a, b) => a + b.speed, 0) / this.cells.length;
    }

    updateBoundary(padding = 0) {
        this.visibleBoundary = this.cells[0].updateBoundary();
        this.cells.forEach((cell, i) => {
            this.visibleBoundary = this.visibleBoundary.enlarge(
                cell.updateBoundary(padding)
            );
        });
        this.visibleBoundary.x -=
            Math.sqrt(this.size) * this.boundaryMultiplier;
        this.visibleBoundary.y -=
            Math.sqrt(this.size) * this.boundaryMultiplier;
        this.visibleBoundary.width +=
            Math.sqrt(this.size) * this.boundaryMultiplier * 2;
        this.visibleBoundary.height +=
            Math.sqrt(this.size) * this.boundaryMultiplier * 2;

        return this.visibleBoundary;
    }

    updateSplitDirection(direction, power) {
        if (direction.x && direction.y) {
            this.splitDirection.x = direction.x / power;
            this.splitDirection.y = direction.y / power;
        }
    }
}
