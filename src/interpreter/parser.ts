import { Expression } from './expressions.js';
import { WanderError } from './values.js';
import { parser } from './wander-lezer-parser.js'

export function parse(script: string): WanderError | Expression[] {
    const parseResults = parser.parse(script);
    let results = [];
    let cursor = parseResults.cursor();
    cursor.next(); //ignore the top "Script" node, should do error checking here
    do {
        let result = parseExpression(cursor, script);
        results.push(result);
    } while (cursor.next())
    return results;
}

function parseExpression(cursor: any, script: string): Expression | WanderError {
    cursor.next(); //TODO should error check here to make sure it's an Expression
    switch (cursor.type.name) {
        case "Int": {
            const value = BigInt(script.substring(cursor.from, cursor.to));
            return {type:"Int", value};
        }
        case "String": {
            const value = script.substring(cursor.from+1, cursor.to-1);
            return {type:"String", value};
        }
        case "Bool": {
            const value = Boolean(script.substring(cursor.from, cursor.to));
            return {type:"Bool", value};
        }
    }
    return "TODO";
}
