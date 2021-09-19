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
// console.log(jArr);


// loop through an existing nested array
let arr1 = [[1], [2, 3], [4], [5, 6]];
for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1[i].length; j++) {
        // console.log(arr1[i][j]);
    }
}

// while loops
let ct = 0;
let yetAnotherArr = []
while (ct < 5) {
    yetAnotherArr.push(ct)
    ct++;
}
console.log(yetAnotherArr)

// do stuff first and then check condition last
let ct1 = 5;
let yetAnotherArr1 = []
do {
    yetAnotherArr1.push(ct1)
    ct1++;
} while (ct1 < 10)
console.log(yetAnotherArr1)