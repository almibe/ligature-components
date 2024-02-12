import { Immutable, enableMapSet, produce } from "immer";
import { Either, Just, Left, Right } from "purify-ts";
import { Field, FieldPath, WanderError, WanderValue } from "./values";
import { ModuleLibrary } from "./libraries/module-library";

enableMapSet()

export type Scope = Immutable<Array<Map<string, WanderValue>>>;
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
        e.scope[e.scope.length-1].set(field.name, value)
     })
}

export function read(environment: Environment, fieldPath: FieldPath): Either<WanderError, WanderValue> {
    const field = fieldPath.parts[0];
    let offset = environment.scope.length - 1;
    while (offset >= 0) {
        let currentScope = environment.scope[offset];
        if (currentScope.has(field.name)) {
            if (fieldPath.parts.length == 1) {
                return Right(currentScope.get(field.name));
            } else {
                let res = currentScope.get(field.name);
                if (res.type == "Module") {
                    //TODO this doesn't read more than one level deep
                    return Right(res.value.get(fieldPath.parts[1].name))
                } else {
                    return Left(`Couldn't read ${fieldPath}.`);
                }
            }
        }
        offset = offset - 1;
    }
    // console.log(environment.libraries.length)
    // for (const library of environment.libraries) {
    //     const lookup = library.lookup(fieldPath);
    //     if (lookup.isRight()) {
    //         return lookup;
    //     }
    // }
    return Left(`Could not find ${fieldPath.parts.map(name => name.name).join(".")}`);
}
