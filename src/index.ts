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

setTimeout(async () => {
    console.log(json.status ? await new file().setData("new", "hfghdfhfgh", data) : false, 7);
    
}, 5000)

console.log("end");
