import {
    World,
    Engine,
    Events,
    Render,
    Mouse,
    MouseConstraint,
    Resolver,
    Runner,
    Body,
    Bodies,
    Composite,
    Composites,
    Constraint,
} from "matter-js";
import { Viewport } from "pixi-viewport";
import { Simple, SpatialHash } from "pixi-cull";
import * as PIXI from "pixi.js";

import "../styles/style.css";
import joystickHandleImage from "../assets/images/joystick-handle.png";
import { DrawRect, getRectCenter } from "./utils.js";
import Colors from "./colors.js";
import { Player, Cell } from "./player.js";
import Particle from "./particle.js";
import Joystick from "./controller.js";

const DEBUG = false;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WORLD_WIDTH = 100000;
const WORLD_HEIGHT = 100000;
const WORLD_CENTER = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 };

export default class Game {
    constructor() {
        // Matter init
        this.engine = Engine.create();
        this.engine.gravity.x = 0;
        this.engine.gravity.y = 0;
        this.engine.gravity.scale = 0;

        // PIXI init
        this.app = new PIXI.Application({
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: 0x37323b,
        });

        document.querySelector("#game").appendChild(this.app.view);
        document.body.scrollTop = 0;
        document.body.style.overflow = "hidden";

        this.keys = {};
        this.splitted = false;

        // use different containers as screen
        this.startScreen = new PIXI.Container();
        this.startScreen.visible = false;

        this.mainScreen = new PIXI.Container();
        this.mainScreen.visible = true;
        this.mainScreen.interactive = true;
        this.mainScreen.filters = [new PIXI.filters.FXAAFilter()];
        this.mainScreen.hitArea = new PIXI.Rectangle(0, 0, WIDTH, HEIGHT);

        this.endScreen = new PIXI.Container();
        this.endScreen.visible = false;

        this.app.stage.addChild(
            this.startScreen,
            this.mainScreen,
            this.endScreen
        );

        // viewpoint

        this.viewportVelocity = { x: 0, y: 0 };
        this.viewport = new Viewport({
            screenWidth: this.app.view.offsetWidth,
            screenHeight: this.app.view.offsetHeight,
            worldWidth: WORLD_WIDTH,
            worldHeight: WORLD_HEIGHT,
            interaction: this.app.renderer.plugins.interaction,
        });
        this.mainScreen.addChild(this.viewport);

        // add joystick
        this.resetVelocityTimeout = null;
        this.joystick = new Joystick({
            canvas: this.mainScreen,
            inner: PIXI.Sprite.from(joystickHandleImage),
            onStart: () => {
                this.resetVelocityTimeout = setTimeout(() => {
                    this.viewportVelocity = { x: 0, y: 0 };
                }, 110);
            },
            onChange: this.updateViewpointVelocity.bind(this),
        });
        this.mainScreen.addChild(this.joystick);

        // add red boxes
        this.particles = [];
        this.particleShapes = [
            "circle",
            "triangle",
            "rect",
            "pentagon",
            "hexagon",
        ];
        const colorKeys = Object.keys(Colors);
        for (let i = 0; i < WORLD_HEIGHT / 30; i++) {
            const particle = new Particle({
                x: Math.random() * WORLD_WIDTH,
                y: Math.random() * WORLD_HEIGHT,
                engine: this.engine,
                canvas: this.viewport,
                size: Math.random() * 20 + 35,
                worldCenter: WORLD_CENTER,
                color: Colors[
                    colorKeys[(colorKeys.length * Math.random()) << 0]
                ],
                shape: this.particleShapes[
                    Math.floor(Math.random() * this.particleShapes.length)
                ],
            });
            this.particles.push(particle);
            this.viewport.addChild(particle);
        }
        // cull whenever the viewport moves
        this.cull = new Simple(true); // new SpatialHash();
        this.cull.addList(this.viewport.children);
        this.cull.cull(this.viewport.getVisibleBounds());

        // add player
        this.player = new Player({
            x: WORLD_CENTER.x,
            y: WORLD_CENTER.y,
            engine: this.engine,
            app: this.app,
            size: 200,
            worldCenter: WORLD_CENTER,
            texture: PIXI.Texture.WHITE,
        });
        this.player.cells.forEach((val, i, arr) => {
            this.viewport.addChild(val);
        });

        // add debug rect
        this.rect = new DrawRect();
        this.rect1 = new DrawRect(0xedd79a);
        this.viewport.addChild(this.rect, this.rect1);

        // add text
        this.text1 = new PIXI.Text("Welcome title!");
        this.text1.x = this.app.view.width / 2;
        this.text1.y = this.app.view.height / 2;
        this.text1.anchor.set(0.5);
        this.text1.style = new PIXI.TextStyle({
            fill: 0x000000,
            fontSize: 40,
            fontFamily: "Arcade",
            stroke: 0xffffff,
            strokeThickness: 3,
        });

        this.startScreen.addChild(this.text1);

        // setup end screen
        this.endRect = new PIXI.Graphics();
        this.endRect.beginFill(0xedd79a);
        this.endRect.drawRect(0, 0, this.app.view.width, this.app.view.height);

        this.text2 = new PIXI.Text("End of Game!");
        this.text2.x = this.app.view.width / 2;
        this.text2.y = this.app.view.height / 2;
        this.text2.anchor.set(0.5);
        this.text2.style = new PIXI.TextStyle({
            fill: 0x00f000,
            fontSize: 40,
            fontFamily: "Arcade",
            stroke: 0xffffff,
            strokeThickness: 3,
        });
        this.endScreen.addChild(this.endRect, this.text2);

        // add event listeners
        // Events.on(this.engine, "beforeUpdate", () => {
        //     this.player.cells.forEach((cell) =>
        //         Body.setAngularVelocity(cell.body, 0)
        //     );
        // });
    }

    start() {
        window.addEventListener("keydown", this.handleKeysDown.bind(this));
        window.addEventListener("keyup", this.handleKeysUp.bind(this));

        this.app.ticker.add(this.gameLoop.bind(this));
    }

    showProgress(e) {
        console.log(e.progress);
    }
    doneLoading() {
        console.log("DONE LOADING!");

        start();
    }
    showError(e) {
        console.error("ERROR!", e.message);
    }

    handleKeysDown(e) {
        // console.log(e.keyCode, e.key);
        this.keys[e.keyCode] = true;

        if (e.keyCode === 32) {
            const newCells = this.player.split();
            newCells.forEach((cell) => this.viewport.addChild(cell));
            this.splitted = true;
        }

        this.switchContainer(e);
    }

    handleKeysUp(e) {
        this.keys[e.keyCode] = false;
    }

    switchContainer(e) {
        switch (e.keyCode) {
            case 49:
                this.startScreen.visible = true;
                this.mainScreen.visible = false;
                this.endScreen.visible = false;
                break;
            case 50:
                this.startScreen.visible = false;
                this.mainScreen.visible = true;
                this.endScreen.visible = false;
                break;
            case 51:
                this.startScreen.visible = false;
                this.mainScreen.visible = false;
                this.endScreen.visible = true;
                break;
        }
    }

    updateViewpointVelocity(data) {
        clearTimeout(this.resetVelocityTimeout);

        this.velocityPower = data.power;
        const angle = (data.angle * Math.PI) / 180;
        this.viewportVelocity.x = Math.cos(angle) * data.power;
        this.viewportVelocity.y = Math.sin(angle) * data.power;
    }

    rectsIntersect(a, b, checkCenter = true) {
        if (checkCenter) {
            let smallObject;
            let largeObject;

            if (a.size > b.size) {
                smallObject = b;
                largeObject = a;
            } else {
                smallObject = a;
                largeObject = b;
            }

            const largeObjectBox = largeObject.updateBoundary(0);
            return largeObjectBox.contains(smallObject.posX, smallObject.posY);
        } else {
            return a.updateBoundary(0).intersects(b.updateBoundary(0));
        }
    }

    handleCollision() {
        this.player.cells.forEach((cell) => {
            const objects = this.cull.query(cell.updateBoundary());

            objects.forEach((object) => {
                if (object === cell || object.name === "rect") return;

                // collide with particle
                if (object instanceof Particle) {
                    if (this.rectsIntersect(cell, object, true)) {
                        this.handleEat(cell, object);
                    }
                }
                // collide with itself
                // else if (this.rectsIntersect(cell, object, false)) {
                // this.handleSelfCollision(cell, object);
                // }
            });
        });
    }

    handleSelfCollision(a, b) {
        let smallObject;
        let largeObject;

        if (a.size > b.size) {
            smallObject = b;
            largeObject = a;
        } else {
            smallObject = a;
            largeObject = b;
        }
        const smallObjectBox = smallObject.updateBoundary(0);
        const largeObjectBox = largeObject.updateBoundary(0);
        const diffX = smallObject.x - largeObject.x;
        const diffY = smallObject.y - largeObject.y;
        const minDist = smallObject.size + largeObject.size;

        const depthX = diffX > 0 ? minDist - diffX : -minDist - diffX;
        const depthY = diffY > 0 ? minDist - diffY : -minDist - diffY;
        // console.log(depthX, depthY);
        if (Math.abs(depthX) < Math.abs(depthY)) {
            // Collision along the X axis. React accordingly
            if (depthX > 0) {
                console.log("collide right");
                smallObject.x += 1;
            } else {
                console.log("collide left");
                smallObject.x -= 1;
            }
        } else {
            // Collision along the Y axis.
            if (depthY > 0) {
                console.log("collide bottom");
                smallObject.y += 1;
            } else {
                console.log("collide top");
                smallObject.y -= 1;
            }
        }

        // console.log(smallObjectBox, largeObjectBox);
        this.rect.update(
            smallObjectBox.x,
            smallObjectBox.y,
            smallObjectBox.width,
            smallObjectBox.height
        );
        this.rect1.update(
            largeObjectBox.x,
            largeObjectBox.y,
            largeObjectBox.width,
            largeObjectBox.height
        );
    }

    handleEat(cell, object) {
        if (object instanceof Particle) {
            cell.updateSize(object.size);
            this.viewport.removeChild(object);
            this.particles.splice(this.particles.indexOf(object), 1);
        }
    }

    gameLoop() {
        if (!this.mainScreen.visible) return;
        
        this.player.updateSpeed();
        this.player.updateBoundary(500);
        this.player.updateSplitDirection(
            this.viewportVelocity,
            this.velocityPower
        );
        this.player.updatePosition({
            x: this.viewportVelocity.x * this.player.speed,
            y: this.viewportVelocity.y * this.player.speed,
        });

        this.viewport.moveCenter(this.player.x, this.player.y);
        this.viewport.fit(
            true,
            this.player.visibleBoundary.width,
            this.player.visibleBoundary.height
        );
        this.cull.cull(this.viewport.getVisibleBounds());

        this.handleCollision();

        // update engine
        Engine.update(this.engine);
        this.player.updateCellsPosition();

        if (DEBUG) {
            this.rect.update(x - 500, y - 500, 1000, 1000);
            this.rect1.update(
                this.player.visibleBoundary.x,
                this.player.visibleBoundary.y,
                this.player.visibleBoundary.width,
                this.player.visibleBoundary.height
            );
            console.log(
                center.x - x,
                center.y - y,
                this.viewportVelocity.x * this.player.speed,
                this.viewportVelocity.y,
                this.player.speed
            );
            let testDiv = document.getElementById("test");
            testDiv.textContent = `${Math.round(center.x - x)}, ${Math.round(
                center.y - y
            )}, ${Math.round(
                this.viewportVelocity.x * this.player.speed ** 2
            )}, ${Math.round(
                this.viewportVelocity.y * this.player.speed ** 2
            )}, speed: ${Math.round(this.player.speed)},
            ${Math.round(this.velocityPower)},
            ${this.app.screen.width / this.app.screen.height}`;
        }
    }
}
