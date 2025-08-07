import { run } from "@ligature/ligature"
import { showEditor } from './editor/editor.js'
import markdownit from 'markdown-it'

export {showEditor};

const md = markdownit()

export function runScript(script, element) {
    let fns = new Map([
    ["append-md",(arg) => {
        if (arg.type == "Element") {
            let result = md.render(arg.value)
            let resultEl = document.createElement("div")            
            resultEl.innerHTML = result
            element.appendChild(resultEl)
        } else {
            throw "Unexpected value."
        }
    }],
    ["append-network", (arg) => {
        throw "TODO"
    }],
    ["append-table", (arg) => {
        throw "TODO"
    }]])

    run(script, element, fns)
}
