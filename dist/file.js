import fs from "fs";
import { createKey } from "./createKey.js";
class File {
    file = {
        name: "",
        password: "",
        dir: ""
    };
    fakeFiles = [];
    constructor(url, name) {
        if (this.file.name && this.file.dir) {
            this.rename(url);
        }
        else {
            if (name) {
                this.file = {
                    ...this.file,
                    name: name,
                    dir: url
                };
            }
            console.log(this.file);
            this.create(url);
        }
    }
    read() {
        fs.readFile();
    }
    create(dir) {
        const name = createKey(1, "code2").str;
        const password = createKey(1, "code2").str;
        fs.writeFile(`${dir + name}.json`, "{}", err => {
            err ? console.log("err") : this.file = {
                name: name,
                password: password,
                dir: dir
            };
            console.log(this.file);
        });
    }
    delete() {
    }
    rename(dir) {
        const name = createKey(1, "code2").str;
        const password = createKey(1, "code2").str;
        fs.rename(this.file.name, `${dir + name}.json`, err => {
            err ? console.log("err") : this.file = {
                name: name,
                password: password,
                dir: dir
            };
        });
    }
}
export default function getFile(url) {
    new File(url);
}
//# sourceMappingURL=file.js.map