// Destructuring Assignment

let loc = {x: 2.3, y: 4.1356, z: 9};
let {x: a, y: b, z: c} = loc; // fast way to assign multiple variables
console.log(a, b, c);

let [x, y, , ...z] = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // remove 3, and z gets all the rest of the values
console.log(x, y, z);

let j = 1, k = 2;
console.log(j, k);
(() => {[j, k] = [k, j];})(); // must switch values in a function
console.log(j, k);

// pass partial attributes from an object to a function
const stats = {
    max: 100,
    min: 1.12,
    median: 20,
    mode: 34.12,
    avg: 50,
}
function half({max, min}) {
    return (max + min) / 2;
}
console.log(half(stats))

// create object with exact name
function createHuman(name, age, gender, hasGoofBall) {
    return {name, age, gender, hasGoofBall}
}
console.log(createHuman('Manson', 12, "F", false))