import { Either } from "purify-ts";
import { Expression } from "./expressions";
import { WanderError } from "./values";
import { parse } from "./parser";

export interface IntrospectionResult {
    readonly script: string
    readonly expressions: Either<WanderError, Expression[]>
}

export function introspect(script: string): IntrospectionResult {
    return {
        script,
        expressions: parse(script)
    }
}
