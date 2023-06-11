import { Flags, FlagsMap } from "../index"

export const validateFlags = (flags: FlagsMap): Error[] => {
    const errors = []
    if(flags.get(Flags.LATEST) && !isTimestamp(flags.get(Flags.LATEST) || '')) {
        errors.push(new Error("LATEST_FLAG_INVALID"))
    }
    if(flags.get(Flags.OLDEST) && !isTimestamp(flags.get(Flags.OLDEST) || '')) {
        errors.push(new Error("OLDEST_FLAG_INVALID"))
    }
    if(flags.get(Flags.LIMIT) && !isNumber(flags.get(Flags.LIMIT) || '')) {
        errors.push(new Error("LIMIT_FLAG_INVALID"))
    }
    if(flags.get(Flags.TRANSLATE_TO_NATIVE) && !isValidTranslationValue(flags.get(Flags.TRANSLATE_TO_NATIVE) || '')) {
        errors.push(new Error("TRANSLATE_TO_FLAG_INVALID"))
    }
    return errors
}

const isTimestamp = (str: string): boolean => {
    const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    return timestampRegex.test(str);
}

const isNumber = (str: string): boolean => {
    const numberRegex = /^\d+$/;
    return numberRegex.test(str);
}

const isValidTranslationValue = (str: string): boolean => {
    return str === "true" || str === "false"
}