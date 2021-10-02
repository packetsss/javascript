let myVar = 55;

// === for type and value check, == for only value check
if (typeof myVar === "number") {
    console.log("strict equality");
    if (myVar == "55") {
        console.log("loose equality");
    }
}

if (myVar != "55") {
    console.log("not equal");
} else if (myVar >= 54 && myVar <= 57) {
    console.log("target greater than 54 and less than 57");
}

if (!myVar || myVar === true) {
    console.log("or");
}

// Switch Statements
let cond = 1;
let ans = "";
switch (cond) {
    case 1:
        ans = "1";
        break;
    case 2:
        ans = "1 + 1";
        break;
    case 3:
        ans = "1 + 2";
        break;
    case 4:
    case 5:
    case 6: // omit break statements
        ans = "within 4 to 6";
        break;
    default:
        ans = "mum loves me";
        break;
}
console.log(ans);

// Ternary Operator
let a = 2;
let b = 3;
let c = "2";
a === b ? console.log("equal") : (a == c ? console.log("not equal") : console.log("completely not equal")); // we can nest ternary operator


