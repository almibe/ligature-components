import { Either, Right } from "purify-ts";
import { HostFunction, WanderError, WanderValue } from "../values";

export interface ModuleLibrary {
    lookup(name: string): Either<WanderError, WanderValue>
}

export function hostLibrary(fns: HostFunction[]): ModuleLibrary {
    return {
        lookup: (name: string) => {
            console.log("In look up", name)
            return Right({type: "Module", value: new Map()})
        }
    }
}
