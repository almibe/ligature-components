import { Left, Right } from "purify-ts";
import { FieldPath, HostFunction } from "../values";
import { ModuleLibrary } from "./module-library";

export function hostLibrary(fns: HostFunction[]): ModuleLibrary {
    return {
        lookup: (fieldPath: FieldPath) => {
            for (const hostFunction of fns) {
                if (hostFunction.fieldPath == fieldPath) {
                    return Right(hostFunction);
                }
            }
            return Left(`${fieldPath} not found.`)
        }
    }
}
