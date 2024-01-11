import { Environment } from './environment.js';
import { Expression } from './expressions.js';
import { parse } from './parser.js';
import { ArrayValue, WanderError, WanderResult, WanderValue } from './values.js';
import { Either, Left, Right } from 'purify-ts/Either';

export function evaluateScript(expressions: Expression[], environment: Environment): WanderResult {
    let result: WanderResult = Left("No result.");
    expressions.forEach(expression => {
        result = evaluate(expression, environment);
    })
    return result;
}

export function evaluate(expression: Expression, environment: Environment): WanderResult {
    if (expression.type != undefined) {
        switch ((expression as Expression).type) {
            case "Int": case "String": case "Bool": case "Array": case "Module":
                return Right(expression as WanderValue);
            default:
                return Left(`Could not evaluate. -- ${JSON.stringify(expression)}`);
        }    
    } else {
        return Left(expression);
    }
}

export function run(script: string): WanderResult {
    const parseResults = parse(script);
    if (parseResults.isLeft()) {
        return parseResults;
    } else {
        return evaluateScript(parseResults.unsafeCoerce(), {});
    }
}

export function printResult(result: WanderResult): string {
    if (result.isLeft()) {
        return result.leftOrDefault("Error");
    } else {
        return printValue(result.unsafeCoerce());
    }
}

export function printValue(value: WanderValue): string {
    switch (value.type) {
        case 'Int': return value.value.toString();
        case 'Bool': return value.value.toString();
        case 'String': return JSON.stringify(value.value);
        case 'Array': return printArray(value.value)
        case 'Module': return printModule(value.value)
        default: return `Unknown type: ${JSON.stringify(value)}`
    }
}

export function printArray(values: WanderValue[]): string {
    let result = "["
    values.forEach(e => result += printValue(e) + ", ")
    result += "]"
    return result;
}

export function printModule(values: Map<string, WanderValue>): string {
    let result = "{"
    values.forEach((v,k) => result += k + " = " + printValue(v) + ", ")
    result += "}"
    return result;
}