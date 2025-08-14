import { run } from "@ligature/ligature"
import { showEditor } from '../../ligature-stencil/src/components/wander-editor/editor.js'
import markdownit from 'markdown-it'
import { appendNetwork } from "./network/network.js";
import { appendTable } from "./table/table.js";

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
            throw "Unexpected value passed to append-md."
        }
    }],
    ["append-network", (arg) => {
        appendNetwork(arg, element)
    }],
    ["append-table", (arg) => {
        appendTable(arg, element)
    }]])

    run(script, element, fns)
}
