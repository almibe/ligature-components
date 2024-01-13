import { ApplicationExpr, Expression, LambdaExpr, WhenExpr } from './expressions.js';
import { WanderError, WanderValue } from './values.js';
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
    if (expressionNode.firstChild.to === expressionNode.lastChild.to && expressionNode.firstChild.from === expressionNode.lastChild.from) {
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
            case "FieldName": {
                return Right({type:"Name", value: script.substring(childNode.from, childNode.to)});
            }
            case "Grouping": {
                return parseGrouping(childNode, script);
            }
            case "Lambda": {
                return parseLambda(childNode, script);
            }
            case "Application": {
                return parseApplication(childNode, script);
            }
            case "When": {
                return parseWhen(childNode, script);
            }
            default: {
                return Left(`Error: Unexpected type ${childNode.type.name}`);
            }
        }
    } else {
        return Left(`Error: Unexpected type ${expressionNode.type.name}`);
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

function parseApplication(applicationNode: any, script: string): Either<WanderError, ApplicationExpr> {
    const nameNode = applicationNode.getChild("FieldName");
    const name = {type: "Name", value: script.substring(nameNode.from, nameNode.to)};
    const args = parseExpressions(applicationNode, script);
    if (args.isLeft()) {
        return args;
    } else {
        return Right({type: "Application", name, args: args.unsafeCoerce() })
    }
}

function parseLambda(lambdaNode: any, script: string): Either<WanderError, LambdaExpr> {
    let parameters = lambdaNode.getChildren("FieldName").map(childNode => script.substring(childNode.from, childNode.to))
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

function parseField(element: any, script: string): [string, WanderValue] {
    let fieldName = script.substring(element.getChild("FieldName").from, element.getChild("FieldName").to);
    let value = parseExpression(element.getChild("Expression"),script);
    return [fieldName, value.unsafeCoerce()];
}
