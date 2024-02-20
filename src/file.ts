import fs from "fs"
import { createKey } from "./createKey.js"
import type { AllFile, KeyFile, createFileReturn } from './types.js'

let file: createFileReturn = {
    name: "",
    suffix: "",
    password: "",
    dir: ""
}

let fakeFiles: createFileReturn[] = []

const request = async (url: fs.PathOrFileDescriptor, options?: { name: string, suffix: string, password: string }) => {
    if (options?.name) {
        const prev = file
        file = {
            ...file,
            ...options,
            dir: url
        }
        return await read()
            .then(async () => {
                return await rename(url, options.name, options.suffix)
                    .then(res => {
                        return { status: true, res, getData, setData }
                    })
                    .catch(err => {
                        file = prev
                        return { status: false, res: err }
                    })
            })
            .catch(err => {
                file = prev
                return { status: false, err }
            })
    } else {
        return await create(url, undefined, { change: "create" })
            .then(res => {
                return { status: true, res, getData, setData }
            })
            .catch(err => {
                return { status: false, err }
            })
    }
}

const setData = async (type: "new" | "edit", name: string, data: KeyFile) => {
    try {
        if (type === "new") {
            await checkData(name)
                .then(() => new Error(`${name} it exists`))

            if (await newData(name, data)) {
                return { status: true }
            } else {
                throw new Error("can not set new Data")
            }
        } else {
            await checkData(name)
                .catch(() => new Error("not found"))

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
        await checkData(name)
            .catch(() => new Error("not found"))

        const data = await read()
            .then(res => {
                const json = JSON.parse(`${res}`)
                return json[name]
            })
            .catch(() => new Error("can not read file"))

        if (await data) return { status: true, res: data }
        else new Error("can not get data")
    } catch (err) {
        return { staus: false, res: err }
    }
}

const read = async () => {
    try {
        const data = await fs.promises.readFile(`${file.dir + file.name}.${file.suffix}`)

        return data.toString()
    } catch (err) {
        return err
    }
}

const create = async (dir: fs.PathOrFileDescriptor, data?: AllFile, options?: { type?: "basic" | "copy" | "fake", change?: "create" | "edit" }) => {
    const name = options?.change === "edit" ? file.name : createKey(1, "code2").str
    const suffix = options?.change === "edit" ? file.suffix : createKey(1, "code2").str
    const password = options?.change === "edit" ? file.password : createKey(1, "code2").str

    try {
        fs.writeFile(`${dir + name}.${suffix}`, data ? JSON.stringify(data) : options?.change === "create" ? "{}" : "", err => { if (err) throw new Error("can not write file") })
        if (!options || !options.type || options.type === "basic") {
            file = { name, suffix, password, dir };
            return file;
        } else if (options.type === "fake") {
            fakeFiles.push({ name, suffix, password, dir });
            return { name, suffix, password, dir };
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
        file = { name, suffix, password, dir }
        return file
    } catch (err) {
        return err
    }
}

const checkData = async (name: string) => {
    try {
        let check = false

        await read()
            .then(data => JSON.parse(`${data}`)[name] ? check = true : new Error(`${name} is not found!`))
            .catch(err => new Error(err))

        return check
    } catch (err) {
        return err
    }
}

const newData = async (name: string, value: KeyFile) => {
    try {
        const prevFile = file

        const data = await read()
            .then(res => {

                let json = JSON.parse(`${res}`)


                json[name] = value

                return json
            })
            .catch(() => undefined)


        if (await data === undefined) throw new Error("can not read file")

        const res = await create(file.dir, data, { change: "edit" })

        if (res === file) {
            return await remove(prevFile.dir, prevFile.name, prevFile.suffix)
        } else throw new Error("can not add new Data")
    } catch {
        return false
    }
}

export { request }