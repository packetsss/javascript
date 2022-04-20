import * as PIXI from "pixi.js";
import "../styles/style.css";
import _bloat from "../assets/images/bloat.png";
import _player from "../assets/images/player.png";
import _bullet from "../assets/images/bullet.png";
import _girl1 from "../assets/images/1.png";
import _girl2 from "../assets/images/2.png";
import _girl3 from "../assets/images/3.png";
import _forest_front from "../assets/forest-pack/front.png";
import _forest_middle from "../assets/forest-pack/middle.png";
import _forest_back from "../assets/forest-pack/back.png";

const NORMAL = 0xffffff;
const OVER = 0x00ff00;
const DOWN = 0xff0000;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let app;
let mainScreen;
let startScreen;
let endScreen;

let r1;
let r2;
let r3;

let startRect;
let endRect;
let text1;
let text2;

let tiling;
let bgFront;
let bgMiddle;
let bgBack;
let bgX = 0;
let bgSpeed = 0.2;

let pos;
let rect;
let girl;
let player;
let playerSpeed = 5;
let enemy;
let keys = {};
let keysDiv;
let bullet;
let bullets = [];
let bulletSpeed = 10;
let pointerIsDown = false;
let pointerIsOver = false;

class Player extends PIXI.Sprite {
    constructor(x, y, texture, name, speed = playerSpeed, anchor = 0.5) {
        super(texture);
        this.anchor.set(anchor);
        this.name = name;
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    status() {
        return `${this.name}, ${this.speed}`;
    }

    autoMove() {
        this.x += this.speed;
        if (
            this.x > app.view.width - this.width / 2 ||
            this.x < this.width / 2
        ) {
            this.speed = -this.speed;
        }
    }
}

window.onload = () => {
    // create app
    app = new PIXI.Application({
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: 0xaaaaaa,
    });
    document.querySelector("#gameDiv").appendChild(app.view);

    // use different containers as screen
    startScreen = new PIXI.Container();
    mainScreen = new PIXI.Container();
    endScreen = new PIXI.Container();

    startScreen.visible = false;
    mainScreen.visible = true;
    endScreen.visible = false;

    app.stage.addChild(startScreen, mainScreen, endScreen);

    // setup title screen
    startRect = new PIXI.Graphics();
    startRect.beginFill(0xff0000);
    startRect.drawRect(0, 0, app.view.width, app.view.height);

    // add text
    text1 = new PIXI.Text("Welcome title!");
    text1.x = app.view.width / 2;
    text1.y = app.view.height / 2;
    text1.anchor.set(0.5);
    text1.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 40,
        fontFamily: "Arcade",
        stroke: 0xffffff,
        strokeThickness: 3,
    });

    startScreen.addChild(startRect, text1);

    // setup end screen
    endRect = new PIXI.Graphics();
    endRect.beginFill(0xedd79a);
    endRect.drawRect(0, 0, app.view.width, app.view.height);

    text2 = new PIXI.Text("End of Game!");
    text2.x = app.view.width / 2;
    text2.y = app.view.height / 2;
    text2.anchor.set(0.5);
    text2.style = new PIXI.TextStyle({
        fill: 0x00f000,
        fontSize: 40,
        fontFamily: "Arcade",
        stroke: 0xffffff,
        strokeThickness: 3,
    });
    endScreen.addChild(endRect, text2);

    // preload assets (can use for progress bar)
    // app.loader.baseUrl = "../assets/images";
    app.loader
        .add("player_sprite", _player)
        .add("bloat_sprite", _bloat)
        .add("bullet_sprite", _bullet)
        .add("girl1", _girl1)
        .add("girl2", _girl3)
        .add("girl3", _girl2)
        .add("forest_front", _forest_front)
        .add("forest_middle", _forest_middle)
        .add("forest_back", _forest_back);
    app.loader.onProgress.add(showProgress);
    app.loader.onComplete.add(doneLoading);
    app.loader.onError.add(showError);
    app.loader.load();
};

function start() {
    // add moving background
    bgBack = createBackground(app.loader.resources["forest_back"].texture);
    bgMiddle = createBackground(app.loader.resources["forest_middle"].texture);
    bgFront = createBackground(app.loader.resources["forest_front"].texture);

    // add girl assets
    girl = new PIXI.Sprite.from(app.loader.resources["girl1"].texture);
    girl.x = 100;
    girl.y = 100;
    girl.width *= 0.5;
    girl.height *= 0.5;
    girl.anchor.set(0.5);
    girl.interactive = true;
    girl.buttonMode = true;
    girl.on("pointerup", girlDoPointerUp);
    girl.on("pointerdown", girlDoPointerDown);
    girl.on("pointerover", girlDoPointerOver);
    girl.on("pointerout", girlDoPointerOut);
    girl.on("pointerupoutside", girlDoPointerUpOutside);
    mainScreen.addChild(girl);

    // add player sprite after loaded assets
    player = new Player(
        app.view.width / 2,
        app.view.height / 2,
        app.loader.resources["player_sprite"].texture,
        "player",
        playerSpeed,
        0.5
    );

    enemy = new Player(
        app.view.width - 200,
        app.view.height / 2,
        app.loader.resources["player_sprite"].texture,
        "enemy",
        playerSpeed,
        0.5
    );
    mainScreen.addChild(player, enemy);

    // clickable buttons (pointer events)

    startScreen.addChild(
        createRect(
            app.view.width / 2 - 100,
            app.view.height / 2 - 280,
            200,
            200,
            "welcome",
            0
        )
    );

    r1 = createRect(100, 450, 100, 100, "rect01", 20);
    r2 = createRect(300, 450, 100, 100, "rect01", 40);
    r3 = createRect(500, 450, 100, 100, "rect01", 80);
    endScreen.addChild(r1, r2, r3);

    // mouse interactions
    // mainScreen.interactive = true;
    // mainScreen.on("pointermove", movePlayer);

    // keyboard event handlers
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);
    document
        .querySelector("#gameDiv")
        .addEventListener("pointerdown", fireBullet);

    app.ticker.add(gameLoop);
    keysDiv = document.querySelector("#keys");
}

function showProgress(e) {
    console.log(e.progress);
}
function doneLoading() {
    console.log("DONE LOADING!");

    start();
}
function showError(e) {
    console.error("ERROR!", e.message);
}

function movePlayer(e) {
    // make sprite follow mouse
    pos = e.data.global;

    player.x = pos.x;
    player.y = pos.y;
}

function createBackground(texture) {
    tiling = new PIXI.TilingSprite(texture, WIDTH, HEIGHT);
    // resize texture
    tiling.scale.x = 8;
    tiling.scale.y = 8;
    // make texture not blurry
    tiling.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    tiling.position.set(0, 0);
    mainScreen.addChild(tiling);

    return tiling;
}
function updateBackground() {
    bgX += bgSpeed;
    bgFront.tilePosition.x = bgX;
    bgMiddle.tilePosition.x = bgX / 2;
    bgBack.tilePosition.x = bgX / 4;
}

function createRect(x, y, w, h, name, speed) {
    rect = new PIXI.Graphics();
    rect.beginFill(NORMAL);
    rect.drawRect(x, y, w, h);
    rect.endFill();
    rect.interactive = true;
    rect.buttonMode = true;
    rect.on("pointerup", doPointerUp);
    rect.on("pointerdown", doPointerDown);
    rect.on("pointerover", doPointerOver);
    rect.on("pointerout", doPointerOut);
    rect.on("pointerupoutside", doPointerUpOutside);
    rect.name = name;
    rect.speed = speed;

    return rect;
}

function keysDown(e) {
    console.log(e.keyCode, e.key);
    keys[e.keyCode] = true;

    switchContainer(e);
    switchBackgroundDirection(e);

    if (e.keyCode === 32) {
        fireBullet();
    }
}

function keysUp(e) {
    keys[e.keyCode] = false;
}

function doPointerUp() {
    if (pointerIsOver) {
        this.tint = OVER;
        this.y = this.y - this.speed;
    } else {
        this.tint = NORMAL;
    }
    pointerIsDown = false;
}
function doPointerDown() {
    this.tint = DOWN;
    pointerIsDown = true;
}
function doPointerOver() {
    if (!pointerIsOver) {
        this.tint = OVER;
        pointerIsOver = true;
    }
}
function doPointerOut() {
    if (!pointerIsDown) {
        this.tint = NORMAL;
        pointerIsOver = false;
    }
}
function doPointerUpOutside() {
    this.tint = NORMAL;
    pointerIsOver = false;
    pointerIsDown = false;
}
function girlDoPointerUp() {
    if (pointerIsOver) {
        girl.texture = app.loader.resources["girl3"].texture;
    } else {
        girl.texture = app.loader.resources["girl1"].texture;
    }
    pointerIsDown = false;
}
function girlDoPointerDown() {
    girl.texture = app.loader.resources["girl2"].texture;
    pointerIsDown = true;
}
function girlDoPointerOver() {
    if (!pointerIsOver) {
        girl.texture = app.loader.resources["girl3"].texture;
        pointerIsOver = true;
    }
}
function girlDoPointerOut() {
    if (!pointerIsDown) {
        girl.texture = app.loader.resources["girl1"].texture;
        pointerIsOver = false;
    }
}
function girlDoPointerUpOutside() {
    this.tint = NORMAL;
    pointerIsOver = false;
    pointerIsDown = false;
}

function switchContainer(e) {
    // rotate screens when key pressed
    switch (e.keyCode) {
        case 49:
            startScreen.visible = true;
            mainScreen.visible = false;
            endScreen.visible = false;
            break;
        case 50:
            startScreen.visible = false;
            mainScreen.visible = true;
            endScreen.visible = false;
            break;
        case 51:
            startScreen.visible = false;
            mainScreen.visible = false;
            endScreen.visible = true;
            break;
    }
}
function switchBackgroundDirection(e) {
    // rotate screens when key pressed
    switch (e.keyCode) {
        case 189: // -
            bgSpeed /= 2;
            break;
        case 187: // +
            bgSpeed *= 2;
            break;
        case 48: // 0
            bgSpeed = -bgSpeed;
            break;
    }
}

function fireBullet(e) {
    bullets.push(createBullet());
}

function createBullet() {
    bullet = new PIXI.Sprite.from(
        app.loader.resources["bullet_sprite"].texture
    );
    bullet.anchor.set(0.5);
    bullet.x = player.x;
    bullet.y = player.y;
    bullet.speed = bulletSpeed;
    mainScreen.addChild(bullet);

    return bullet;
}

function updateBullets(delta) {
    bullets.forEach((x, i, arr) => {
        x.position.y -= x.speed;
        if (x.position.y < 0) {
            // remove from array
            bullets.splice(i, 1);
            // remove from canvas
            mainScreen.removeChild(x);
        }
    });
}

function rectsIntersect(a, b) {
    let aBox = a.getBounds();
    let bBox = b.getBounds();

    return (
        aBox.x + aBox.width > bBox.x &&
        aBox.x < bBox.x + bBox.width &&
        aBox.y + aBox.height > bBox.y &&
        aBox.y < bBox.y + bBox.height
    );
}

function gameLoop() {
    // keysDiv.innerHTML = JSON.stringify(keys);

    // w
    if (keys["87"]) {
        player.y -= playerSpeed;
    }
    // a
    if (keys["65"]) {
        player.x -= playerSpeed;
    }
    // s
    if (keys["83"]) {
        player.y += playerSpeed;
    }
    // d
    if (keys["68"]) {
        player.x += playerSpeed;
    }

    if (rectsIntersect(player, enemy)) {
        playerSpeed = 0;
    } else {
        playerSpeed = 5;
    }
    enemy.autoMove();
    updateBullets();
    updateBackground();
}
