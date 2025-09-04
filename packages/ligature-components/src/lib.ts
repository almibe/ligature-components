import { run, printResult } from "@ligature/ligature"
import { showEditor } from "./editor/editor.js";
import markdownit from 'markdown-it'
import { appendNetwork } from "./network/network.js";
import { appendTable } from "./table/table.js";
import { tableauDebug } from "./debug/debug.js";

export {showEditor, printResult};

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
    }],
    ["tableau-debug", (arg) => {
        tableauDebug(arg, element)
    }],])

    return run(script, element, fns)
}
