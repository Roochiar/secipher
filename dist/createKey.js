const code1 = "qwertyuiopasdfghjklzxcvbnm1234567890[]{};:'/?.>,<=+-_)(*&^%$#@!~";
const code2 = "qwertyuiopasdfghjklzxcvbnm1234567890";
export const createKey = (lengthType, type) => {
    const code = type === "code1" ? code1 : code2;
    const random1 = Math.round(((Math.random() * 8) + 8) * lengthType);
    let str = "";
    let arr = [];
    for (let index = 0; index < random1; index++) {
        const random2 = Math.round(Math.random() * (code.length - 1));
        str += code[random2];
    }
    for (let index = 0; index < lengthType; index++) {
        arr.push(str.slice((str.length / lengthType) * index, (str.length / lengthType) * (index + 1)));
    }
    return { str, arr };
};
//# sourceMappingURL=createKey.js.map