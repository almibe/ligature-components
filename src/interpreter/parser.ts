import { Expression } from './expressions.js';
import { WanderError } from './values.js';
import { parser } from './wander-lezer-parser.js'

export function parse(script: string): WanderError | Expression[] {
    const parseResults = parser.parse(script)
    let results = []
    let offset = 0;
    parseResults.children.forEach(child => {
        console.log(JSON.stringify(child))
        switch (child.type.name) {
            case "Int": {
                const value = BigInt(script.substring(offset, offset + child.length))
                results.push({type:"Int", value})
                break;
            }
            case "String": {
                const value = script.substring(offset+1, offset + child.length-1)
                results.push({type:"String", value})
                break;
            }
            case "Bool": {
                const value = Boolean(script.substring(offset, offset + child.length))
                results.push({type:"Bool", value})
                break;
            }
        }
    });
    return results;
}
