let arr = [];
let jArr = [];
// similar for loop to C++
for (let i = 0; i < 10; i++) {
    // backward for loop
    for (let j = 10; j > j % i; j -= 3) {
        jArr.push(`j is ${j} while i is ${i}`);
    }
    arr.push(i);
}
console.log(arr);
console.log(jArr);

function name(a, b) {
    return a > b;
}

// loop through each elements (forEach & for...of)
arr.filter((x) => {
    console.log("filter: ", x);
    return x > 2;
}).forEach((x) => console.log("for each: ", x));

let sum = 0;
arr.forEach((x) => (sum += x));
console.log(sum);

for (const x of arr) {
    sum -= x ** 2;
}
console.log(sum);

// don't use for...in because unordered and inherited properties are also enumerated
Array.prototype.foo = "foo!";
var array = ["a", "b", "c"];

array.forEach((x) => console.log(x, "for each"));

for (var i in array) {
    console.log(array[i], 1); // it also outputs "foo!"
}

// rather use for...in for iterating through objects properties
var obj = {
    a: 1,
    b: 2,
    c: 3,
};

for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
        // or if (Object.prototype.hasOwnProperty.call(obj,prop)) for safety...
        console.log("prop: " + prop + " value: " + obj[prop]);
    }
}

// for loop comprehension using map and filter
console.log(arr.filter((x) => x >= 3 && x < 7).map((x) => x ** 2));

// loop through an existing nested array
let arr1 = [[1], [2, 3], [4], [5, 6]];
for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1[i].length; j++) {
        console.log(arr1[i][j]);
    }
}

// while loops
let ct = 0;
let yetAnotherArr = [];
while (ct < 5) {
    yetAnotherArr.push(ct);
    ct++;
}
console.log(yetAnotherArr);

// do stuff first and then check condition last
let ct1 = 5;
let yetAnotherArr1 = [];
do {
    yetAnotherArr1.push(ct1);
    ct1++;
} while (ct1 < 10);
console.log(yetAnotherArr1);
