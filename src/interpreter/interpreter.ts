//import {run as runScript } from '@wander-lang/wander/Wander'

import { W } from 'vitest/dist/reporters-qc5Smpt5.js';
import { Environment } from './environment.js';
import { Expression } from './expressions.js';
import { parse } from './parser.js';
import { WanderError, WanderValue } from './values.js';

export function evaluateScript(expressions: Expression[], environment: Environment): WanderValue | WanderError {
    let result = "No result.";
    expressions.forEach(expression => {
        result = evaluate(expression, environment);
    })
    return result;
}

export function evaluate(expression: Expression, environment: Environment): WanderValue | WanderError {
    switch ((expression as Expression).type) {
        case "Int": case "String": case "Bool":
            return expression as WanderValue;
        default:
            return `Could not evaluate. -- ${JSON.stringify(expression)}`;
    }
}

export function run(script: string): WanderValue | WanderError {
    const parseResults = parse(script);
    if (typeof parseResults == "string") {
        return parseResults;
    } else {
        return evaluateScript(parseResults, {});
    }
}

export function printResult(result: WanderValue | WanderError): string {
    if (typeof result == "string") {
        return result
    } else {
        switch (result.type) {
            case 'Int': return result.value.toString();
            default: return `Unknown type: ${JSON.stringify(result)}`
        }
    }
}
