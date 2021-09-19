// ways to export
export const capFirstChar = (str) => str[0].toUpperCase() + str.slice(1);

const foo = "Hey"
const bar = "ne haoooo"
const capStr = (str) => str.toUpperCase();
export {capStr, foo, bar};

// set default export
export default function addTwo (x) {
    return x + 2
}