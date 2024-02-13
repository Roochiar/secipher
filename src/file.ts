import fs from "fs"
import os from 'os'
import { createKey } from "./createKey.js"
import type { AllFile, KeyFile } from './types.js'

class File {
    private file: {
        name: string,
        password: string,
        dir: fs.PathOrFileDescriptor
    } = {
            name: "",
            password: "",
            dir: ""
        }

    private fakeFiles: string[] = []

    public async request(url: fs.PathOrFileDescriptor, options?: { name?: string, password?: string }) {
        if (this.file.name && this.file.dir) {

            await this.rename(url)
        } else {
            if (options?.name) {
                const prev = this.file
                this.file = {
                    ...this.file,
                    ...options,
                    dir: url
                }
                await this.read()
                    .then(res => {
                        return { status: true, res }
                    })
                    .catch(err => {
                        this.file = prev
                        return { status: false, err }
                    })
            } else {
                await this.create(url)
                    .then(res => {
                        return { status: true, res }
                    })
                    .catch(err => {
                        return { status: false, err }
                    })
            }
        }
    }

    public setData() {

    }

    public getData() {

    }

    private async read() {
        try {
            fs.readFile(`${this.file.dir + this.file.name}.json`, { encoding: "utf-8" }, (err, data) => {
                if (err) throw Error(err.message)

                return data
            })
        } catch (err) {
            return err
        }
    }

    private async create(dir: fs.PathOrFileDescriptor) {
        const name = createKey(1, "code2").str
        const password = createKey(1, "code2").str

        try {
            fs.writeFile(`${dir + name}.json`, "{}", err => {
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

    private async remove() {
        try {
            fs.rm(`${this.file.dir + this.file.name}.json`, err => {
                if (err) throw Error(err.message)

                this.file = {
                    name: "",
                    password: "",
                    dir: ""
                }
                return true
            })
        } catch (err) {
            return err
        }
    }

    private async rename(dir: fs.PathOrFileDescriptor) {
        const name = createKey(1, "code2").str
        const password = createKey(1, "code2").str

        try {
            fs.rename(this.file.name, `${dir + name}.json`, err => {
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
            await this.checkData(name)
                .then(() => new Error("This name exists"))


            await this.read()
                .then(data => add(data))
                .catch(err => new Error(err))

            const add = (obj: unknown) => {
                let prevData: AllFile = JSON.parse(`${obj}`)

                prevData[name] = value
            }

            
        } catch (err) {
            return err
        }
    }
}

export default async function getFile(url: fs.PathOrFileDescriptor, options?: { name?: string, password?: string }) {
    return await new File().request(url)
}