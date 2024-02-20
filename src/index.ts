import {request, setData, getData} from './file.js'
import { create } from "./create.js"
import { KeyFile } from './types.js';
import { createKey } from './createKey.js';

const a = "qwertyuiopasdfghjklzxcvbnm"
let data: KeyFile = {}

for (const item of a) {
    data[item] = createKey(1).str
}

const json = await request("./");

console.log(json);


if (json.status) {
    console.log(await json.setData("new", "jhsdofgdfoihdfg", data))
}

console.log("end");
