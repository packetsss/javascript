// function deceleration
function addOne(x) {
    return x += 1;
}
// console.log(addOne(2));

// str concatenation
function concatenateString(str1, str2) {
    return str1 + str2;
}
let rst = concatenateString("Hello ", "Yosuf \"The Werewolf\"");
// console.log(rst);

// var vs let
let globalVar = 2;
function getGlobalVar() {
    // var can be accessed outside if statements, let cannot
    // Both cannot be accessed outside the function
    if (true) {
        var myVar = 55;
    }
    console.log(myVar);
    

    let globalVar = 20; // can overwrite global variable
    return globalVar;
}
// console.log(getGlobalVar());

// simulate queue
function pushInQueue(arr, item) {
    arr.push(item);

    return arr.shift();
}
let arrTested = [1, 2, 3, 4, 5];

// console.log(arrTested);
pushInQueue(arrTested, 6);
// console.log(arrTested);


// random number
function randomInt(begin, end) {
    return Math.floor(Math.random() * (end - begin + 1)) + begin;
}
// console.log(randomInt(0, 3));

// cvt binary to int
function cvtBinary(str) {
    return parseInt(str, 2);
}
// console.log(cvtBinary('1001'));


// anonymous function
const square = x => x * x
// console.log(square(12))
console.log((x => x ** 3)(4)) // directly calling the function instead of assigning it

let newArr = [0, 1, 8.1, 2.12, 3, -2, 1, 15, -9.8, 8]
const squareNonzeroInt = (arr) => {
    return arr.filter(x => Number.isInteger(x) && x > 0).map(x => x * x) // filter and map are built-in array methods
}
// console.log(squareNonzeroInt(newArr))

// rest and spread operators (unpacking)
function sum(...args) { 
    return [args.reduce((a, b) => a + b, 0), "args passed in are", ...args]
}
console.log(sum(1, 2, 3, 6)) 

