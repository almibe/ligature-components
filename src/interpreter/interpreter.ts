import { Environment, bindVariable, newEnvironment, read } from './environment.js';
import { ArrayExpr, BindingExpr, Expression, GroupingExpr, ModuleExpr, NameExpr } from './expressions.js';
import { parse } from './parser.js';
import { WanderResult, WanderValue } from './values.js';
import { Left, Right } from 'purify-ts/Either';

export function evaluateScript(expressions: Expression[], environment: Environment): WanderResult {
    let result: WanderResult = Left("No result.");
    let currentEnvironment = environment;
    if (currentEnvironment == undefined) {
        currentEnvironment = newEnvironment();
    }
    expressions.forEach(expression => {
        result = evaluate(expression, currentEnvironment);
        currentEnvironment = result.unsafeCoerce()[1];
    })
    return result;
}

export function evaluate(expression: Expression, environment: Environment): WanderResult {
    if (expression.type != undefined) {
        switch ((expression as Expression).type) {
            case "Int": case "String": case "Bool":
                return Right([expression, environment]);
            case "Array":
                return evalArray(expression, environment);
            case "Module":
                return evalModule(expression, environment);
            case "Binding":
                return evalBinding(expression, environment);
            case "Name":
                return evalName(expression, environment);
            case "Grouping":
                return evalGrouping(expression, environment);
            default:
                return Left(`Could not evaluate. -- ${JSON.stringify(expression)}`);
        }
    } else {
        return Left(expression);
    }
}

function evalGrouping(groupingExpr: GroupingExpr, environment: Environment): WanderResult {
    let lastResult = {type:"Module", value: new Map()};
    for (const element of groupingExpr.expressions) {
        let result = evaluate(element, environment);
        if (result.isLeft()) {
            return result;
        } else {
            lastResult = result.unsafeCoerce()[0];
        }    
    }
    return Right([lastResult, environment]);
}

function evalName(nameExpr: NameExpr, environment: Environment): WanderResult {
    let res = read(environment, nameExpr.value).toEither("Error in evalName, " + nameExpr.value);
    if (res.isLeft()) {
        return res;
    } else {
        return Right([res.unsafeCoerce(), environment])
    }
}

function evalArray(expression: ArrayExpr, environment: Environment): WanderResult {
    let results = [];
    for (const element of expression.value) {
        let result = evaluate(element, environment);
        if (result.isLeft()) {
            return result;
        } else {
            results.push(result.unsafeCoerce()[0]);
        }    
    }
    return Right([{type:"Array", value: results}, environment]);
}

function evalModule(expression: ModuleExpr, environment: Environment): WanderResult {
    let results = new Map();
    for (const [name, element] of expression.value.entries()) {
        let result = evaluate(element, environment);
        if (result.isLeft()) {
            return result;
        } else {
            results.set(name, result.unsafeCoerce()[0]);
        }    
    }
    return Right([{type:"Module", value: results}, environment]);
}

function evalBinding(expression: BindingExpr, environment: Environment): WanderResult {
    let result = evaluate(expression.value, environment);
    if (result.isLeft()) {
        return result;
    } else {
        let newValue = result.unsafeCoerce()
        let newEnv = bindVariable(environment, expression.name, newValue[0]);
        return Right([newValue[0], newEnv]);
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
