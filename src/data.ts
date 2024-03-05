import { decrypt, encrypt } from "./encrypt.js"
import { KeyFile } from "./types.js"

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

    return { codeData, encodeData }
}

export default handleData