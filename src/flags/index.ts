import {validateFlags} from "./validation"

export enum Flags {
    LATEST = 'latest',
    OLDEST = 'oldest',
    LIMIT = 'limit',
    NEXT_CURSOR = 'next-cursor',
    TRANSLATE_TO_NATIVE = 'translate-to-native',
}

export type FlagsMap = Map<Flags, string>

export const processFlags = (flags: string): [Map<Flags, string>, Error[]] => {
    const flagsArray = flags.split(" ")
    const flagsObject = flagsArray.reduce((acc, flag) => {
        const [key, value] = flag.split("=")
        if(key !in Flags) return acc
        return acc.set(key as Flags, value || 'true')
    }, new Map<Flags, string>())
    const validationErrors = validateFlags(flagsObject);
    if(validationErrors.length > 0) {
        return [flagsObject, validationErrors]
    }
    return [flagsObject, []]
}