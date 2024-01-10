//import {run as runScript } from '@wander-lang/wander/Wander'

import { Environment } from './environment.js';
import { Expression } from './expressions.js';
import { WanderValue } from './values.js';
import { parser } from './wander-lezer-parser.js'

type WanderError = string;

export function parse(script: string): WanderError | Expression[] {
    const parseResults = parser.parse(script)
    let results = []
    let offset = 0;
    parseResults.children.forEach(child => {
        if (child.type.name == "Int") {
            const value = BigInt(script.substring(offset, offset + child.length))
            results.push({type:"Int", value})
        } else {
            throw "Unknown type";
        }
    });
    return results;
}

export function evaluateScript(expressions: Expression[], environment: Environment): WanderValue | WanderError {
    let result = "No result.";
    expressions.forEach(expression => {
        result = evaluate(expression, environment);
    })
    return result;
}

export function evaluate(expression: Expression, environment: Environment): WanderValue | WanderError {
    switch ((expression as Expression).type) {
        case "Int":
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
