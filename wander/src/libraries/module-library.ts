import { Either } from "purify-ts";
import { FieldPath, WanderError, WanderValue } from "../values";

export interface ModuleLibrary {
    lookup(fieldPath: FieldPath): Either<WanderError, WanderValue>
}
