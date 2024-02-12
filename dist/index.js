import file from './file.js';
import { create } from "./create.js";
file("./");
const data = "rooch";
const code = "qwertyuiopasdfghjklzxcvbnm1234567890";
let arrKey = [];
let arr = [];
let obj = {};
for (const item of data) {
    !arr.find(i => i === item) ? arr.push(item) : undefined;
}
arr.forEach(item => {
    let str = "";
    const random1 = Math.round(Math.random() * 5 + 10);
    for (let index = 0; index < random1; index++) {
        const random2 = Math.round(Math.random() * (code.length - 1));
        str += code[random2];
    }
    obj = {
        ...obj,
        [item]: str
    };
});
// console.log(obj);
create(2);
//# sourceMappingURL=index.js.map