import fs from 'fs'
import { request, setData, getData } from './file.js'
import { KeyFile } from './types.js';
import { createKey } from './createKey.js';
import { encrypt, decrypt } from './encrypt.js';

export default async function secipher({
    location, name, suffix, password
}: {
    location: fs.PathOrFileDescriptor,
    name?: string,
    suffix?: string,
    password?: string
}) {
    const resFile = await request(location, { name, suffix, password })

    const handleFile = () => {

    }

    const handleData = () => {
        const codeData = (data: string, keysLength?: number, code?: "code1" | "code2") => {
            const res = encrypt(data, keysLength, code)
            let keys: string[] = []

            if (keysLength) {
                for (let index = 0; index < keysLength; index++) keys.push(res.output.slice(index * (res.output.length / keysLength), (res.output.length / keysLength) * (index + 1)))
            } else keys = [res.output]

            return { keys, codes: res.obj }
        }

        const encodeData = (keys: string[], codes: KeyFile) => {
            return decrypt(keys.join(""), codes)
        }
    }

    const handleUser = () => {

    }

    return { res: resFile, file: handleFile, data: handleData, user: handleUser }
}

console.log("end");
