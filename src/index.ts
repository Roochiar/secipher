import file from './file.js'
import { create } from "./create.js"
import { KeyFile } from './types.js';
import { createKey } from './createKey.js';

const a = "qwertyuiopasdfghjklzxcvbnm"
let data: KeyFile = {}

for (const item of a) {
    data[item] = createKey(1).str
}

const json = await new file().request("./");

// if (await json.status) {
//     new File
// }

console.log("end");
