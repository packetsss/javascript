// function or class for object 
class Person {
    constructor(d){
    this.d = new Date(d)}
}
function Person2(d) {
    this.d = new Date(d)
}

// must use "New" for an object
let p = new Person("3-6-1970")
let q = new Person2("3-6-1970")
console.log(p.d, q.d)

// create function inside an object
const myObj = {
    a: 1,
    func(likeable) {
        return !likeable;
    },
    b: 2
};

// create object (class)
class Person {
    constructor (name, age, isGoof) { // __init__
        this._name = name;
        this._age = age;
        this._isGoof = isGoof;
    }
    // getter and setter
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
}

let person = new Person("Jason", 12, true);
console.log(person)
console.log(person.name);