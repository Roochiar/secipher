import key from './key.js'
import data from './data.js'
import { request, setData, getData } from './file.js'

export default async function secipher() {
    return { key, data, file: { request, setData, getData } }
}