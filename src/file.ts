import fs from "fs"
import os from 'os'
import { createKey } from "./createKey.js"

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

    constructor(url: fs.PathOrFileDescriptor, name?: string) {
        if (this.file.name && this.file.dir) {

            this.rename(url)
        } else {
            if (name) {
                this.file = {
                    ...this.file,
                    name: name,
                    dir: url
                }
            }
            console.log(this.file);
            this.create(url)
        }
    }

    private read() {
        try {
            fs.readFile(`${this.file.dir + this.file.name}.json`, { encoding: "utf-8" }, (err, data) => {
                if (err) throw Error(err.message)

                console.log(data);
                return data
            })
        } catch (err) {
            return err
        }
    }

    private create(dir: fs.PathOrFileDescriptor) {
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
                console.log(this.file);
                return this.file
            })
        } catch (err) {
            return err
        }
    }

    private remove() {
        try {
            fs.rm(`${this.file.dir + this.file.name}.json`, err => {
                if (err) throw Error(err.message)

                return true
            })
        } catch (err) {
            return err
        }
    }

    private rename(dir: fs.PathOrFileDescriptor) {
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
}

export default function getFile(url: fs.PathOrFileDescriptor) {
    new File(url)
}