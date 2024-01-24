import { Immutable, enableMapSet, produce } from "immer";
import { Just, Maybe, Nothing } from "purify-ts";
import { WanderValue } from "./values";
import { ModuleLibrary } from "./libraries/module-library";

enableMapSet()

export type Scope = Immutable<Array<Map<string, WanderValue>>>;
export type Environment = { scope: Scope, libraries: ModuleLibrary[] }

export function newEnvironment(): Environment {
    return { scope: [new Map()], libraries: [] };
}

export function newScope(environment: Environment): Environment {
    return produce(environment, e => { e.scope.push(new Map()) });
}

export function removeScope(environment: Environment): Environment {
    return produce(environment, e => { e.scope.pop() });
}

export function bindVariable(environment: Environment, name: string, value: WanderValue): Environment {
    return produce(environment, e => { 
        e.scope[e.scope.length-1].set(name, value)
     })
}

export function read(environment: Environment, name: string): Maybe<WanderValue> {
    let offset = environment.scope.length - 1;
    while (offset >= 0) {
        let currentScope = environment.scope[offset];
        if (currentScope.has(name)) {
            return Just(currentScope.get(name));
        }
        offset = offset - 1;
    }
    return Nothing;
}
