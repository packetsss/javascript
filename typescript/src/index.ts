/* 
compile:
tsc file-name-without-.ts
if no file specified, it will compile everything

continuously watching:
tsc --watch file-name

create config file:
tsc --init
*/

// Basic Types
let id: number = 5
let company: string = 'Google'
let isGood: boolean = false
let x: any = "" // can be anything
let age: number
x = 2
age = 12.43

let ids: number[] = [1, 2, 3, 4, 5, 6, 7] // array of numbers
ids.push(8)

let arr: any[] = [1.12, "as", true] // any typed array
let person: [number, string, boolean] = [1, "chick", true] // a tuple allows multiple types
let employee: [number, string][] // nested tuple
employee = [
    [1, "chick"],
    [2, "bob"],
]

let newID: string | number = "2" // multiple types (union)

// enum auto assigned values
enum direc {
    up, // 0
    down, // 1
    left = 3, // if we specify here, it will continue growing based on here
    right // 4
}
console.log(direc)

// if not number, must specify everything
enum direcStr {
    up = "up",
    down = "down",
    left = "left",
    right = "right",
}
console.log(direcStr)

// objects
type User = {
    id: number,
    name: string,
} // type first

const user: User =  {
    id: 1,
    name: "Hypoer",
} // assign last
console.log(user)

// type assertion
let cid: any = 1
// let customerId = <number>cid
let customerId = cid as number // cvt customerId to be a number using <> or as


// functions
function add(x: number, y: number): number {
    return x + y
}
console.log(add(2, 4))

function log(msg: string | number): void { // use void when return nothing
    console.log(msg)
}

// interfaces
interface UserInterface {
    readonly id: number, // we cannot assign readonly property
    name: string,
    age?: number // optional property
} // cannot use for primitives and union

const user1: UserInterface =  {
    id: 66,
    name: "Jason",
}

console.log(user1)

interface MathFunc {
    (x: number, y: number): number
}

const subtract: MathFunc = (x, y) => x - y
console.log(subtract(2, 6))

// class
interface PersonInterface {
    name: string // cannot be a private property
    register(): string
}

class Person implements PersonInterface {
    private id: number // cannot be accessed outside the class
    protected cid?: number // can only be accessed here or inherited
    name: string
    
    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }

    register() {
        return `Hello ${this.name}, you are now registered as #${this.id}`
    }
}

const man = new Person(34, "CJ")

// subclasses (inheritance)
class Employee extends Person {
    position: string

    constructor(id: number, name: string, position: string) {
        super(id, name) // initialize Person first
        this.position = position
    }
}

const employe = new Employee(34, "Sharllot", "dev")
console.log(employe.register())

// Generics
function getArray<T>(items: T[]): T[] { // generic placeholder of types
    return new Array().concat(items)
}

let numArr = getArray<number>([1, 2, 3, 4])
let strArr = getArray(["1", "2", "3", "4"]) as string[]

