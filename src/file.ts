import fs from "fs"
import { createKey } from "./createKey.js"
import type { AllFile, KeyFile, createFileReturn } from './types.js'
import { encrypt, decrypt } from "./encrypt.js"

let file: createFileReturn = {
    name: "",
    suffix: "",
    password: "",
    dir: "",
    obj: {}
}

let fakeFiles: createFileReturn[] = []

const request = async (url: fs.PathOrFileDescriptor, { name, suffix, password }: { name?: string, suffix?: string, password?: string }) => {
    const prev = file
    try {

        if (name && suffix && password) {
            file = { ...file, name, suffix, password, dir: url }
            await read()
            const res = await rename(url, name, suffix)
            return { status: true, res }
        } else {
            file = { ...file, dir: url }
            const res = await create(url, undefined, { change: "create" })
            return { status: true, res }
        }
    } catch (err) {
        file = prev
        return { status: false, err }
    }
}


const setData = async (type: "new" | "edit", name: string, data: KeyFile) => {
    try {
        if (type === "new") {
            return await checkData(name)
                .then(() => { throw new Error(`${name} it exists`) })
                .catch(async () => {
                    if (await newData(name, data)) return { status: true }

                    throw new Error("can not set new Data")
                })
        } else {
            await checkData(name)
                .catch(() => { throw new Error("not found") })

            const editedData = await read()
                .then(res => {
                    const json = JSON.parse(`${res}`)
                    return { ...json[name], ...data }
                })
                .catch(() => new Error("can not edit Data"))

            if (await newData(name, editedData)) {
                return { status: true }
            } else {
                throw new Error("can not edit Data")
            }

        }
    } catch (err) {
        return { status: false, res: err }
    }
}

const getData = async (name: string) => {
    try {
        const res = await read().catch(() => { throw new Error("can not read file") })
        const json = await JSON.parse(`${res}`)
        const data = await json[name]

        if (data) {
            return { status: true, res: data }
        } else {
            throw new Error("can not get data")
        }
    } catch (err) {
        return { status: false, res: err }
    }
}


const read = async () => {
    try {
        const data = await fs.promises.readFile(`${file.dir + file.name}.${file.suffix}`)
        return decrypt(data.toString(), file.obj)
    } catch (err) {
        return err
    }
}

const create = async (dir: fs.PathOrFileDescriptor, data?: AllFile, options?: { type?: "basic" | "copy" | "fake", change?: "create" | "edit" }) => {
    let name, suffix, password;
    if (options?.change === "edit") {
        name = file.name;
        suffix = file.suffix;
        password = file.password;
    } else {
        name = createKey(1, "code2").str;
        suffix = createKey(1, "code2").str;
        password = createKey(1, "code2").str;
    }

    try {
        const newData = data ? JSON.stringify(data) : (options?.change === "create" ? "{}" : "");
        const dataEncrypted = encrypt(newData, 2, "code1");
        await fs.promises.writeFile(`${dir + name}.${suffix}`, dataEncrypted.output);

        if (!options || !options.type || options.type === "basic") {
            file = { name, suffix, password, dir, obj: dataEncrypted.obj };
            return file;
        } else if (options.type === "fake") {
            fakeFiles.push({ name, suffix, password, dir, obj: dataEncrypted.obj });
            return { name, suffix, password, dir, obj: dataEncrypted.obj };
        } else {
            return { name, suffix, password, dir };
        }
    } catch (err) {
        return err;
    }
}


const remove = async (dir: fs.PathOrFileDescriptor, name: string, suffix: string) => {
    try {
        await fs.promises.rm(`${dir + name}.${suffix}`)
        return true
    } catch (err) {
        return err
    }
}

const rename = async (dir: fs.PathOrFileDescriptor, fileName: string, fileSuffix: string) => {
    const name = createKey(1, "code2").str
    const suffix = createKey(1, "code2").str
    const password = createKey(1, "code2").str

    try {
        await fs.promises.rename(`${dir + fileName}.${fileSuffix}`, `${dir + name}.${suffix}`)
        file = { ...file, name, suffix, password, dir }
        return file
    } catch (err) {
        return err
    }
}

const checkData = async (name: string) => {
    try {
        let check = false

        await read()
            .then(data => {
                if (JSON.parse(`${data}`)[name]) check = true
                else throw new Error(`${name} is not found!`)
            })
            .catch(err => { throw new Error(err) })

        return check
    } catch (err) {
        return err
    }
}

const newData = async (name: string, value: KeyFile) => {
    try {
        const data = await read()
            .then(res => {
                let json = JSON.parse(`${res}`)
                json[name] = value
                return json
            })
            .catch(() => { throw new Error("can not read data") })

        const res = await create(file.dir, data, { change: "edit" })

        if (res === file) return true
        else throw new Error("can not add new Data")
    } catch {
        return false
    }
}

export { request, getData, setData }