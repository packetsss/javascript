// import from other files
import {capStr, bar} from "./7_export.js";
console.log(capStr(bar));

// import default export (don't need curly braces)
import addTwo from "./7_export.js";
console.log(addTwo(2))

// wildcard import, must use "as"
import * as exp from "./7_export.js";
console.log(exp.foo)
