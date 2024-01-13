import { Immutable, enableMapSet, produce } from "immer";
import { Just, Maybe, Nothing } from "purify-ts";
import { WanderValue } from "./values";

enableMapSet()

export type Environment = Immutable<Array<Map<string, WanderValue>>>;

export function newEnvironment(): Environment {
    return [new Map()];
}

export function newScope(environment: Environment): Environment {
    return produce(environment, e => { e.push(new Map()) });
}

export function removeScope(environment: Environment): Environment {
    return produce(environment, e => { e.pop() });
}

export function bindVariable(environment: Environment, name: string, value: WanderValue): Environment {
    return produce(environment, e => { 
        e[e.length-1].set(name, value)
     })
}

export function read(environment: Environment, name: string): Maybe<WanderValue> {
    let offset = environment.length - 1;
    while (offset >= 0) {
        let currentScope = environment[offset];
        if (currentScope.has(name)) {
            return Just(currentScope.get(name));
        }
        offset = offset - 1;
    }
    return Nothing;
}
