import { Immutable, enableMapSet, produce } from "immer";
import { Just, Maybe, Nothing } from "purify-ts";
import { Field, FieldPath, WanderValue } from "./values";
import { ModuleLibrary } from "./libraries/module-library";

enableMapSet()

export type Scope = Immutable<Array<Map<Field, WanderValue>>>;
export type Environment = { scope: Scope, libraries: ModuleLibrary[] }

export function newEnvironment(libraries: ModuleLibrary[]): Environment {
    return { scope: [new Map()], libraries };
}

export function newScope(environment: Environment): Environment {
    return produce(environment, e => { e.scope.push(new Map()) });
}

export function removeScope(environment: Environment): Environment {
    return produce(environment, e => { e.scope.pop() });
}

export function bindVariable(environment: Environment, field: Field, value: WanderValue): Environment {
    return produce(environment, e => { 
        e.scope[e.scope.length-1].set(field, value)
     })
}

export function read(environment: Environment, fieldPath: FieldPath): Maybe<WanderValue> {
    if (fieldPath.parts.length == 1) {
        const field = fieldPath.parts[0];
        let offset = environment.scope.length - 1;
        while (offset >= 0) {
            let currentScope = environment.scope[offset];
            if (currentScope.has(field)) {
                return Just(currentScope.get(field));
            }
            offset = offset - 1;
        }
    }
    for (const library of environment.libraries) {
        const lookup = library.lookup(fieldPath);
        if (lookup.isRight()) {
            return lookup.unsafeCoerce();
        }
    }
    return Nothing;
}
