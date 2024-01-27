import { Either, Left, Right } from "purify-ts";
import { FieldPath, HostFunction, WanderError, WanderValue } from "../values";

export interface ModuleLibrary {
    lookup(fieldPath: FieldPath): Either<WanderError, WanderValue>
}

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
