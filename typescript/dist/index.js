"use strict";
let id = 5;
let company = 'Google';
let isGood = false;
let x = "";
let age;
x = 2;
age = 12.43;
let ids = [1, 2, 3, 4, 5, 6, 7];
ids.push(8);
let arr = [1.12, "as", true];
let person = [1, "chick", true];
let employee;
employee = [
    [1, "chick"],
    [2, "bob"],
];
let newID = "2";
var direc;
(function (direc) {
    direc[direc["up"] = 0] = "up";
    direc[direc["down"] = 1] = "down";
    direc[direc["left"] = 3] = "left";
    direc[direc["right"] = 4] = "right";
})(direc || (direc = {}));
console.log(direc);
var direcStr;
(function (direcStr) {
    direcStr["up"] = "up";
    direcStr["down"] = "down";
    direcStr["left"] = "left";
    direcStr["right"] = "right";
})(direcStr || (direcStr = {}));
console.log(direcStr);
const user = {
    id: 1,
    name: "Hypoer",
};
console.log(user);
let cid = 1;
let customerId = cid;
function add(x, y) {
    return x + y;
}
console.log(add(2, 4));
function log(msg) {
    console.log(msg);
}
const user1 = {
    id: 66,
    name: "Jason",
};
console.log(user1);
const subtract = (x, y) => x - y;
console.log(subtract(2, 6));
class Person {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    register() {
        return `Hello ${this.name}, you are now registered as #${this.id}`;
    }
}
const man = new Person(34, "CJ");
class Employee extends Person {
    constructor(id, name, position) {
        super(id, name);
        this.position = position;
    }
}
const employe = new Employee(34, "Sharllot", "dev");
console.log(employe.register());
