import { Environment } from './environment.js';
import { Expression } from './expressions.js';
import { parse } from './parser.js';
import { WanderError, WanderResult, WanderValue } from './values.js';

export function evaluateScript(expressions: Expression[], environment: Environment): WanderResult {
    let result: WanderResult = "No result.";
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

export function printResult(result: WanderResult): string {
    if (typeof result == "string") {
        return result
    } else {
        switch (result.type) {
            case 'Int': return result.value.toString();
            case 'Bool': return result.value.toString();
            case 'String': return JSON.stringify(result.value);
            default: return `Unknown type: ${JSON.stringify(result)}`
        }
    }
}
