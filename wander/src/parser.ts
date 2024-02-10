import { ApplicationExpr, Expression, FieldPathExpr, LambdaExpr, WhenExpr } from './expressions.js';
import { Field, WanderError, WanderValue } from './values.js';
import { parser } from './wander-lezer-parser.js';
import { Either, Left, Right } from 'purify-ts/Either';
import { _ } from "lodash";

export function parse(script: string): Either<WanderError, Expression[]> {
    const parseResults = parser.parse(script);
    return parseExpressions(parseResults.topNode, script);
}

/**
 * Given a parent node, read all of the Expression children nodes.
 */
function parseExpressions(node: any, script: string): Either<WanderError, Expression[]> {
    let results: Expression[] = [];
    let expressionNodes = node.getChildren("Expression"); //ignore the top "Script" node, should do error checking here
    expressionNodes.forEach(element => {
        let result = parseExpression(element, script);
        if (result.isRight()) {
            results.push(result.unsafeCoerce());
        } else {
            throw result.leftOrDefault("Error");
        }
    });
    return Right(results);
}

function parseExpression(expressionNode: any, script: string): Either<WanderError, Expression> {
    //TODO double check node is an expression
    if (expressionNode.firstChild != null && expressionNode.firstChild.to === expressionNode.lastChild.to && expressionNode.firstChild.from === expressionNode.lastChild.from) {
        let childNode = expressionNode.firstChild;
        switch (childNode.type.name) {
            case "Int": {
                const value = BigInt(script.substring(childNode.from, childNode.to));
                return Right({type:"Int", value});
            }
            case "String": {
                const value = script.substring(childNode.from+1, childNode.to-1);
                return Right({type:"String", value});
            }
            case "Bool": {
                const value = script.substring(childNode.from, childNode.to) === "true";
                return Right({type:"Bool", value});
            }
            case "Array": {
                return parseArray(childNode, script);
            }
            case "Module": {
                return parseModule(childNode, script);
            }
            case "Field": {
                return parseBinding(childNode, script);
            }
            case "Name": {
                return parseFieldPath(childNode, script) //Right({type:"Name", value: script.substring(childNode.from, childNode.to)});
            }
            case "Grouping": {
                return parseGrouping(childNode, script);
            }
            case "Lambda": {
                return parseLambda(childNode, script);
            }
            case "Expression": {
                return parseApplication(childNode, script);
            }
            case "When": {
                return parseWhen(childNode, script);
            }
            case "Application": {
                return parseApplication(childNode, script);
            }
            default: {
                return Left(`Error: Unexpected type ${childNode.type.name}`);
            }
        }
    } else {
        if (expressionNode.firstChild == null) {
            const value = script.substring(expressionNode.from, expressionNode.to).split(".").map(name => {name})
            return Right({type:"FieldPath", value });
        }
        return Left(`Error: Unexpected type ${expressionNode.type.name}`);
    }
}

function parseSingleExpression(childNode: any, script: string): Either<WanderError, Expression> {
        switch (childNode.type.name) {
            case "Int": {
                const value = BigInt(script.substring(childNode.from, childNode.to));
                return Right({type:"Int", value});
            }
            case "String": {
                const value = script.substring(childNode.from+1, childNode.to-1);
                return Right({type:"String", value});
            }
            case "Bool": {
                const value = script.substring(childNode.from, childNode.to) === "true";
                return Right({type:"Bool", value});
            }
            case "Array": {
                return parseArray(childNode, script);
            }
            case "Module": {
                return parseModule(childNode, script);
            }
            case "Field": {
                return parseBinding(childNode, script);
            }
            case "Name": {
                return parseFieldPath(childNode, script) //Right({type:"Name", value: script.substring(childNode.from, childNode.to)});
            }
            case "Grouping": {
                return parseGrouping(childNode, script);
            }
            case "Lambda": {
                return parseLambda(childNode, script);
            }
            case "Expression": {
                return parseApplication(childNode, script);
            }
            case "When": {
                return parseWhen(childNode, script);
            }
            case "Application": {
                return parseApplication(childNode, script);
            }
            default: {
                return Left(`Error: Unexpected type ${childNode.type.name}`);
            }
        }
}

function parseWhen(whenNode: any, script: string): Either<WanderError, WhenExpr> {
    let body = _.chunk(
        whenNode
        .getChildren("Expression")
        .map(e => parseExpression(e, script).unsafeCoerce()
        ), 2)
    return Right({type: "When", body});
}

function parseFieldPath(node: any, script: string): Either<WanderError, FieldPathExpr> {
    const fullName = script.substring(node.from, node.to).split(".").map(value => {return { name: value}})
    const name = {type: "FieldPath", value: {parts: fullName}};
    return Right(name)
}

function parseApplication(applicationNode: any, script: string): Either<WanderError, ApplicationExpr> {
    let child = applicationNode.firstChild;
    const name = script.substring(child.from, child.to);
    const fullName = name.split(".").map(name => {return {name}});
    child = child.nextSibling;
    const args = [];
    while (child != null) {
        const res = parseSingleExpression(child, script);
        if (res.isLeft()) {
            return res;
        } else {
            args.push(res.unsafeCoerce());
            child = child.nextSibling;
        }    
    }
    return Right({type: "Application", fieldPath: {type: "FieldPath", value: {parts: fullName}}, args });
}

function parseLambda(lambdaNode: any, script: string): Either<WanderError, LambdaExpr> {
    let parameters = lambdaNode.getChildren("Name")
        .map(childNode => {return {name: script.substring(childNode.from, childNode.to)}})
    let body = parseExpression(lambdaNode.getChild("Expression"), script)
    if (body.isLeft()) {
        return body;
    } else {
        return Right({ type: "Lambda", parameters, body: body.unsafeCoerce() });
    }
}

function parseBinding(bindingNode: any, script: string): Either<WanderError, Expression> {
    let result = parseField(bindingNode, script);
    return Right({ type: "Binding", name: result[0], value: result[1]})
}

function parseGrouping(groupingNode: any, script: string): Either<WanderError, Expression> {
    if (groupingNode.firstChild == null) {
        return Right({ type:"Array", value: [] });
    } else {
        const value = parseExpressions(groupingNode, script);
        if (value.isRight()) {
            return Right({ type: "Grouping", expressions: value.unsafeCoerce() });
        } else {
            return Left(value.leftOrDefault("Error in parseArray."))
        }
    }
}

function parseArray(arrayNode: any, script: string): Either<WanderError, Expression> {
    if (arrayNode.firstChild == null) {
        return Right({ type:"Array", value: [] });
    } else {
        const value = parseExpressions(arrayNode, script);
        if (value.isRight()) {
            return Right({ type: "Array", value: value.unsafeCoerce() });
        } else {
            return Left(value.leftOrDefault("Error in parseArray."))
        }
    }
}

function parseModule(moduleNode: any, script: string): Either<WanderError, Expression> {
    if (moduleNode.firstChild == null) {
        return Right({ type:"Module", value: new Map() });
    } else {
        const value = parseFields(moduleNode, script);
        return Right({ type: "Module", value });
    }
}

function parseFields(moduleNode: any, script: string): Map<string, WanderValue> {
    let fieldNodes = moduleNode.getChildren("Field");
    let results = [];
    fieldNodes.forEach(element => {
        results.push(parseField(element, script))
    });
    return new Map(results);
}

function parseField(element: any, script: string): [Field, WanderValue] {
    let name = script.substring(element.getChild("Name").from, element.getChild("Name").to);
    let value = parseExpression(element.getChild("Expression"),script);
    return [{ name }, value.unsafeCoerce()];
}
