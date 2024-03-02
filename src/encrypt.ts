import { createKey } from "./createKey.js"
import { KeyFile } from "./types.js"

const encrypt = (input: string, level: number = 1, type: "code1" | "code2" = "code1") => {
    const obj: KeyFile = {};
    let output: string = "";

    const generateUniqueKey = (): string => {
        const newKey = createKey(level, type).str;
        return Object.values(obj).includes(newKey) ? generateUniqueKey() : newKey;
    };

    for (const item of input) {
        let key = obj[item] || generateUniqueKey();

        if (!obj[item]) {
            obj[item] = key;
        }

        if (key !== "") {
            output += key;
        } else {
            throw new Error("cannot find a unique key");
        }
    }

    return { output, obj };
}

const decrypt = (input: string, obj: KeyFile) => {
    let output = "";

    for (let i = 0; i < input.length;) {
        let foundMatch = false;
        for (const key in obj) {
            if (input.startsWith(obj[key], i)) {
                output += key;
                i += obj[key].length;
                foundMatch = true;
                break;
            }
        }

        if (!foundMatch) {
            return new Error("Could not decrypt");
        }
    }

    return output;
}


export { encrypt, decrypt }