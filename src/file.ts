import fs from "fs"
import { createKey } from "./createKey.js"
import type { AllFile, KeyFile, createFileReturn } from './types.js'

export default class File {
    private file: createFileReturn = {
        name: "",
        suffix: "",
        password: "",
        dir: ""
    }

    private fakeFiles: createFileReturn[] = []

    public async request(url: fs.PathOrFileDescriptor, options?: { name: string, suffix: string, password: string }) {
        if (options?.name) {
            const prev = this.file
            this.file = {
                ...this.file,
                ...options,
                dir: url
            }
            return await this.read()
                .then(async () => {
                    return await this.rename(url, options.name!)
                        .then(res => {
                            return { status: true, res }
                        })
                        .catch(err => {
                            this.file = prev
                            return { status: false, res: err }
                        })
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
            fs.readFile(`${this.file.dir + this.file.name}.${this.file.suffix}`, (err, data) => {
                console.log(err, data);

                if (err) new Error(err.message)
                else return data.toString()
            })
        } catch (err) {
            return err
        }
    }

    private async create(dir: fs.PathOrFileDescriptor, data?: AllFile, options?: { type?: "basic" | "copy" | "fake" }) {
        const name = createKey(1, "code2").str
        const suffix = createKey(1, "code2").str
        const password = createKey(1, "code2").str

        try {
            await fs.promises.writeFile(`${dir + name}.${suffix}`, data ? JSON.stringify(data) : "{}");

            if (!options || !options.type || options.type === "basic") {
                this.file = { name, suffix, password, dir };
                return this.file;
            } else if (options.type === "fake") {
                this.fakeFiles.push({ name, suffix, password, dir });
                return { name, suffix, password, dir };
            } else {
                return { name, suffix, password, dir };
            }
        } catch (err) {
            return err;
        }

    }

    private async remove(dir: fs.PathOrFileDescriptor, name: string) {
        try {
            fs.rm(`${dir + name}.json`, err => {
                if (err) new Error(err.message)
                return true
            })
        } catch (err) {
            return err
        }
    }

    private async rename(dir: fs.PathOrFileDescriptor, fileName: string) {
        const name = createKey(1, "code2").str
        const suffix = createKey(1, "code2").str
        const password = createKey(1, "code2").str

        try {
            fs.rename(`${dir + fileName}.${suffix}`, `${dir + name}.json`, err => {
                if (err) Error(err.message)

                this.file = { name, suffix, password, dir }
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
            } else new Error("can not add new Data")
        } catch (err) {
            return err
        }
    }
}