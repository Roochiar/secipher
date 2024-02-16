import fs from "fs"
import os from 'os'
import { createKey } from "./createKey.js"
import type { AllFile, KeyFile, createFileReturn } from './types.js'

class File {
    private file: createFileReturn = {
        name: "",
        password: "",
        dir: ""
    }

    private fakeFiles: createFileReturn[] = []

    public async request(url: fs.PathOrFileDescriptor, options?: { name?: string, password?: string }) {
        if (this.file.name && this.file.dir) {
            return await this.rename(this.file.dir, this.file.name)
                .then(res => {
                    return { status: true, res }
                })
                .catch(err => {
                    return { status: false, res: err }
                })
        } else {
            if (options?.name) {
                const prev = this.file
                this.file = {
                    ...this.file,
                    ...options,
                    dir: url
                }
                return await this.read()
                    .then(res => {
                        return { status: true, res }
                    })
                    .catch(err => {
                        this.file = prev
                        return { status: false, err }
                    })
            } else {
                return await this.create(url)
                    .then(res => {
                        return { status: true, res }
                    })
                    .catch(err => {
                        return { status: false, err }
                    })
            }
        }
    }

    public async setData(type: "new" | "edit", name: string, data: KeyFile) {
        try {
            if (type === "new") {
                await this.checkData(name)
                    .then(() => new Error(`${name} it exists`))

                if (await this.newData(name, data)) {
                    return { status: true }
                } else {
                    new Error("can not set new Data")
                }
            } else {
                await this.checkData(name)
                    .catch(() => new Error("not found"))

                const editedData = await this.read()
                    .then(res => {
                        const json = JSON.parse(`${res}`)
                        return { ...json[name], ...data }
                    })
                    .catch(() => new Error("can not edit Data"))

                if (await this.newData(name, editedData)) {
                    return { status: true }
                } else {
                    new Error("can not edit Data")
                }

            }
        } catch (err) {
            return { status: false, res: err }
        }
    }

    public async getData(name: string) {
        try {
            await this.checkData(name)
                .catch(() => new Error("not found"))

            const data = await this.read()
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

    private async read() {
        try {
            fs.readFile(`${this.file.dir + this.file.name}.json`, (err, data) => {
                if (err) throw Error(err.message)

                return data.toString()
            })
        } catch (err) {
            return err
        }
    }

    private async create(dir: fs.PathOrFileDescriptor, data?: AllFile, options?: { type?: "basic" | "copy" | "fake" }) {
        const name = createKey(1, "code2").str
        const password = createKey(1, "code2").str

        try {
            fs.writeFile(`${dir + name}.json`, data ? JSON.stringify(data) : "{}", err => {
                if (err) throw new Error(err.message)

                if (!options || !options.type || options.type === "basic") {
                    this.file = {
                        name: name,
                        password: password,
                        dir: dir
                    }
                    return this.file
                } else if (options.type === "fake") {
                    this.fakeFiles.push({
                        name: name,
                        password: password,
                        dir: dir
                    })
                    return {
                        name: name,
                        password: password,
                        dir: dir
                    }
                } else {
                    return {
                        name: name,
                        password: password,
                        dir: dir
                    }
                }
            })
        } catch (err) {
            return err
        }
    }

    private async remove(dir: fs.PathOrFileDescriptor, name: string) {
        try {
            fs.rm(`${dir + name}.json`, err => {
                if (err) throw new Error(err.message)
                return true
            })
        } catch (err) {
            return err
        }
    }

    private async rename(dir: fs.PathOrFileDescriptor, fileName: string) {
        const name = createKey(1, "code2").str
        const password = createKey(1, "code2").str

        try {
            fs.rename(`${dir + fileName}.json`, `${dir + name}.json`, err => {
                if (err) throw Error(err.message)

                this.file = {
                    name: name,
                    password: password,
                    dir: dir
                }
                return this.file
            })
        } catch (err) {
            return err
        }
    }

    private async checkData(name: string) {
        try {
            let check = false

            await this.read()
                .then(data => JSON.parse(`${data}`)[name] ? check = true : new Error(`${name} is not found!`))
                .catch(err => new Error(err))

            return check
        } catch (err) {
            return err
        }
    }

    private async newData(name: string, value: KeyFile) {
        try {
            const prevFile = this.file

            const data = await this.read()
                .then(res => {
                    let json = JSON.parse(`${res}`)

                    json[name] = value

                    return json
                })
                .catch(err => new Error("can not read file", err))


            const create = await this.create(this.file.dir, data)

            if (create === this.file) {
                return await this.remove(prevFile.dir, prevFile.name)
            } else throw new Error("can not add new Data")
        } catch (err) {
            return err
        }
    }
}

export default async function getFile(url: fs.PathOrFileDescriptor, options?: { name?: string, password?: string }) {
    const file = new File()

    return { request: file.request, setData: file.setData, getData: file.getData }
}