import fs from 'fs'

export type KeyFile = {
    [$key: string] : string
}

export type AllFile = {
    [$key: string] : KeyFile
}

export type createFileReturn = {
    name: string,
    suffix: string,
    password: string,
    dir: fs.PathOrFileDescriptor
}