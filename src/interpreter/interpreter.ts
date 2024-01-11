import { produce } from 'immer';
import { Environment, bindVariable } from './environment.js';
import { BindingExpr, Expression } from './expressions.js';
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
            case "Int": case "String": case "Bool":
                return Right([expression, environment]);
            case "Array":
                return Right([expression, environment]); //TODO handle elements
            case "Module":
                return Right([expression, environment]); //TODO handle elements
            case "Binding":
                return evalBinding(expression, environment);
            default:
                return Left(`Could not evaluate. -- ${JSON.stringify(expression)}`);
        }
    } else {
        return Left(expression);
    }
}

function evalBinding(expression: BindingExpr, environment: Environment): WanderResult {
    let result = evaluate(expression.value, environment);
    if (result.isRight) {
        return result;
    } else {
        return bindVariable(environment, expression.name, result.unsafeCoerce());
    }
}

export function run(script: string, environment: Environment): WanderResult {
    const parseResults = parse(script);
    if (parseResults.isLeft()) {
        return parseResults;
    } else {
        return evaluateScript(parseResults.unsafeCoerce(), environment);
    }
}

export function printResult(result: WanderResult): string {
    if (result.isLeft()) {
        return result.leftOrDefault("Error");
    } else {
        return printValue(result.unsafeCoerce()[0]);
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
