import { Either, Maybe } from "purify-ts";
import { FieldPath, ModuleValue, WanderError, WanderValue } from "../values";

export interface ModuleLibrary {
    lookup(id: string): Either<WanderError, Maybe<ModuleValue>>
}
