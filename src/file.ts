import fs from "fs"
import { createKey } from "./createKey.js"
import type { AllFile, KeyFile, createFileReturn } from './types.js'
import { encrypt, decrypt } from "./encrypt.js"

let file: createFileReturn = {
    name: "",
    suffix: "",
    dir: "",
    obj: {}
}

let fakeFiles: createFileReturn[] = []

const request = async (url: fs.PathOrFileDescriptor, { name, suffix, obj }: { name?: string, suffix?: string, obj?: { [$key: string]: string } }, lengthFakeFiles?: number) => {
    const prev = file
    try {
        if (name && suffix && obj) {
            file = { ...file, name, suffix, obj, dir: url }
            await read()
            const res = await rename(url, name, suffix)
            return { status: true, res }
        } else {
            file = { ...file, dir: url }
            const res = await create(url, undefined, { change: "create" })
            await createFakeFiles(createFakeData({}), lengthFakeFiles)
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
                    if (await newData(name, data)) return { status: true, res: file.obj }

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
                return { status: true, res: file.obj }
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

const create = async (dir: fs.PathOrFileDescriptor, data?: AllFile, options?: { type?: "basic" | "copy" | "fake", change?: "create" | "edit", name?: string, suffix?: string }) => {
    let { name, suffix } = options?.change === "edit" ? {
        name: options.name || file.name,
        suffix: options.suffix || file.suffix
    } : {
        name: options?.name || createKey(1, "code2").str,
        suffix: options?.suffix || createKey(1, "code2").str
    }

    try {
        const newData = data ? JSON.stringify(data) : (options?.change === "create" ? "{}" : "")
        const dataEncrypted = encrypt(newData, 2, "code1")
        await fs.promises.writeFile(`${dir + name}.${suffix}`, dataEncrypted.output)

        if (!options || !options.type || options.type === "basic") {
            file = { name, suffix, dir, obj: dataEncrypted.obj }
            return file
        } else if (options.type === "fake") {
            fakeFiles.push({ name, suffix, dir, obj: dataEncrypted.obj })
            return { name, suffix, dir, obj: dataEncrypted.obj }
        } else {
            return { name, suffix, dir }
        }
    } catch (err) {
        return err
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

    try {
        await fs.promises.rename(`${dir + fileName}.${fileSuffix}`, `${dir + name}.${suffix}`)
        file = { ...file, name, suffix, dir }
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

const newData = async (name: string, value: KeyFile, lengthFakeFiles?: number) => {
    try {
        const data = await read()
            .then(res => {
                let json = JSON.parse(`${res}`)
                json[name] = value
                return json
            })
            .catch(() => { throw new Error("can not read data") })

        const res = await create(file.dir, data, { change: "edit" })
        await createFakeFiles(createFakeData(data), lengthFakeFiles)

        if (res === file) return true
        else throw new Error("can not add new Data")
    } catch {
        return false
    }
}

const createFakeData = (data: AllFile) => {
    const fakeData: AllFile = {}
    const keys: string[] = []
    const values: KeyFile[] = []

    for (const key of Object.keys(data)) {
        keys.push(createKey(1, "code1").str)
    }

    for (const value of Object.values(data)) {
        const obj: KeyFile = {}
        for (const item of Object.keys(value)) {
            obj[item] = createKey(1, "code1").str
        }
        values.push(obj)
    }

    for (let index = 0; index < keys.length; index++) {
        fakeData[keys[index]] = values[index]
    }

    return fakeData
}

const createFakeFiles = async (fakeData: AllFile, length: number = Math.round(Math.random() * 8 + 8)) => {
    try {
        const filesToRemove = fakeFiles.splice(length)
        for (const fileToRemove of filesToRemove) {
            await remove(fileToRemove.dir, fileToRemove.name, fileToRemove.suffix)
        }

        for (let index = 0; index < length; index++) {
            const fakeFileProps: createFileReturn = fakeFiles[index] ? {
                dir: file.dir,
                name: fakeFiles[index].name,
                suffix: fakeFiles[index].suffix,
                obj: fakeFiles[index].obj
            } : {
                dir: file.dir,
                name: createKey(1, "code2").str,
                suffix: createKey(1, "code2").str,
                obj: {}
            }

            await create(fakeFileProps.dir, fakeData, { type: "fake", change: fakeFiles[index] ? "edit" : "create", ...fakeFileProps })
            fakeFiles[index] = fakeFileProps
        }

        return true
    } catch (err) {
        return err
    }
}

export { request, getData, setData }