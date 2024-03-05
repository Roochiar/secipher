import { createKey } from "./createKey.js"

const handleKey = (keysLength?: number, level?: number, code?: "code1" | "code2") => {
    let keys: string[] = []

    if (keysLength) {
        for (let index = 0; index < keysLength; index++) keys.push(createKey(level || 1, code).str)
    } else keys = [createKey(level || 1, code).str]

    return keys
}

export default handleKey