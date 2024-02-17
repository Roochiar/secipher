import file from './file.js'
import { create } from "./create.js"

const json = await new file().request("./");

setTimeout(async () => {
    console.log(json.status ? await new file().request(json.res!.dir, json.res!) : false);
    
}, 5000)

console.log("end");
