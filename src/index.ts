import fs from 'fs'
import { request, setData, getData } from './file.js'
import { KeyFile } from './types.js';
import { createKey } from './createKey.js';
import { encrypt, decrypt } from './encrypt.js';

// export default async function secipher() {
//     const handleKey = (keysLength?: number, level?: number, code?: "code1" | "code2") => {
//         let keys: string[] = []

//         if (keysLength) {
//             for (let index = 0; index < keysLength; index++) keys.push(createKey(level || 1, code).str)
//         } else keys = [createKey(level || 1, code).str]

//         return keys
//     }

//     const handleData = () => {
//         const codeData = (data: string, keysLength?: number, code?: "code1" | "code2") => {
//             const res = encrypt(data, keysLength, code)
//             let keys: string[] = []

//             if (keysLength) {
//                 for (let index = 0; index < keysLength; index++) keys.push(res.output.slice(index * (res.output.length / keysLength), (res.output.length / keysLength) * (index + 1)))
//             } else keys = [res.output]

//             return { keys, codes: res.obj }
//         }

//         const encodeData = (keys: string[], codes: KeyFile) => {
//             return decrypt(keys.join(""), codes)
//         }

//         return { codeData, encodeData }
//     }

//     return { key: handleKey, data: handleData, file: { request, setData, getData } }
// }

await request("./file/", {})
    .then(async () => {
        console.log(await setData("new", "jfpasjfpisjfspfj", {f: "hafpisafpsdfsfph"}))
    })
    .catch(err => {
        console.log(err, 45);
    })

console.log("end");
