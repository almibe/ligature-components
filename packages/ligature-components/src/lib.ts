import { run } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'

export {showEditor};

export function runScript(script, element) {
    let fns = new Map([
    ["append-md",(arg) => {
        console.log("In append-md" + arg)
    }],
    ["append-network", (arg) => {
        throw "TODO"
    }],
    ["append-table", (arg) => {
        throw "TODO"
    }]])

    run(script, element, fns)
}
