/*
Run in terminal:
node index.js
*/


/*
Variable cannot be a reserved name
if, let, const...

Types, dynamic typing:
string literal, number literal, boolean literal

Primitives / Value Types:
String, Number, Boolean, undefined, null

Reference Types
Object (dictionary?), Array, Function
*/
const aConstantNumber = 2.2; // cannot reassign or change a constant
const mutableArr = [2, 4, 3, 6];
mutableArr[0] = 99; // but we can change values within a const
Object.freeze(mutableArr); // freeze the array to immutable
mutableArr[0] = 200;
console.log(mutableArr);

let hisName = "Arron Gooferball";
let templateString = `The number is: ${aConstantNumber}
and goof you!`;
console.log(templateString);
console.log(hisName.length, hisName[hisName.length - 1], hisName.slice(6, -2)); // some string methods

let age = 10; // only number, no int or float
let isOK = false;
let firstName = undefined; // undefined typed
let color = null; // object typed
console.log(hisName, age, isOK, firstName, color, typeof (hisName), typeof (color));

/* 
Objects
Access properties(values)

Use dot notation default
Use bracket notation when dynamic accessing properties
*/
let anObject = {
    nname: "Paul",
    age: 1,
    hasChicken: true,
    myArray: [
        "ok",
        1,
        {"what is inside": "nested objects"},
    ]
};
console.log(anObject.myArray[2]["what is inside"]); // access nested objects
delete anObject.myArray[2]; // make this index empty
anObject.myArray = anObject.myArray.filter((anObject) => anObject); // remove empty elements in the array
console.log(anObject);

anObject.nname = null;

console.log(anObject.nname);
let access = ['hasChicken', 'age'];
for (let i in access) {
    console.log(access[i], ":", anObject[access[i]]);
}


/*
Arrays:
can assign out of index value, and it will fill the gap with empty
*/

let array = ["red", 25, true]; // can hold multiple datatype and can be manipulated
array[5] = 2;
array[4] = "Okay I get it";
console.log(array);

let nestedArray = [[1, 2], [3, 4]]; // nested array
console.log(nestedArray);
console.log(nestedArray.pop()); // remove last element
console.log(nestedArray.shift()); // remove first element
nestedArray.unshift("I'm back"); // append front to start of the array
nestedArray.push("last element"); // append to the end of the array
console.log(nestedArray);
console.log(nestedArray.concat([2, 45, 6])); // concat the array



