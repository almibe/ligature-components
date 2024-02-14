import { Either } from "purify-ts";
import { Expression } from "./expressions";
import { WanderError } from "./values";
import { parse } from "./parser";

export interface InspectionResult {
    readonly script: string
    readonly expressions: Either<WanderError, Expression[]>
}

export function inspect(script: string): InspectionResult {
    return {
        script,
        expressions: parse(script)
    }
}
