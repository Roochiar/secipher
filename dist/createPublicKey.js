const code = "qwertyuiopasdfghjklzxcvbnm1234567890";
export const createPublicKey = (lengthType) => {
    const random1 = Math.round((Math.random() * lengthType * 10) * lengthType);
    let str = "";
    let keys = [];
    for (let index = 0; index < random1; index++) {
        const random2 = Math.round(Math.random() * (code.length - 1));
        str += code[random2];
    }
    for (let index = 0; index < lengthType; index++) {
        keys.push(str.slice((str.length / lengthType) * index, (str.length / lengthType) * (index + 1)));
    }
    console.log(str, keys);
};
//# sourceMappingURL=createPublicKey.js.map