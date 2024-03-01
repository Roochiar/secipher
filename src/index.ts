import { request, setData, getData } from './file.js'
import { create } from "./create.js"
import { KeyFile } from './types.js';
import { createKey } from './createKey.js';
import { encrypt, decrypt } from './encrypt.js';

const a = "qwertyuiopasdfghjklzxcvbnm"
let data: KeyFile = {}

for (const item of a) {
    data[item] = createKey(1).str
}

await request("./", {})
    .then(async (json) => {
        console.log(json);

        await setData("new", "oihdfg", data)
            .then(() => console.log(true, 18))
            .catch(() => console.log(false, 19))

        await getData("oihdfg")
            .then(res => console.log(res, 23))
            .catch(() => console.log(false, 24))
    })
    .catch(err => console.log(err))



console.log("end");
