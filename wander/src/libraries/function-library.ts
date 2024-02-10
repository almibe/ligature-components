import { Either, Maybe } from "purify-ts";
import { FieldPath, WanderError, WanderValue } from "../values";

export interface FunctionLibrary {
    call(fieldPath: FieldPath, args: WanderValue[]): Either<WanderError, Maybe<WanderValue>>
}
