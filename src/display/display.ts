import { Entry, Role, run } from "@ligature/ligature";
import { showText } from "../text/text";
import { showTable } from "../table/table";
import { showGraph } from "../graph/graph";
import { showNotebook } from "../notebook/notebook";

export function defaultDisplays(): Map<string, (element: HTMLElement, network: Entry[]) => void> {
    const displays = new Map()
    displays.set('text', showText)
    displays.set('graph', showGraph)
    displays.set('table', showTable)
    displays.set('notebook', showNotebook)
    return displays
}

export function display(el: HTMLElement, content: any, displays: Map<string, (element: HTMLElement, network: Entry[]) => void>) {
    if (el != null) {
        el.removeAttribute("class")
        el.replaceChildren()
        if (content["meta"] != undefined && content["result"] != undefined) {
            const meta = content["meta"] as Entry[]
            const res = meta.filter((entry) => 
                entry.type == "role" && 
                entry.first.symbol == "display" && 
                entry.role.symbol == "=")
            if (res.length == 1) {
                const displayType = (res[0] as Role).second.symbol
                const display = displays.get(displayType)
                if (display != undefined) {
                    el.classList.add("ligature-display-" + displayType)
                    display(el, content["result"])
                } else {
                    throw "Invalid display metadata provided, only text, graph, or table display supported currently."
                }
            } else {
                throw "Invalid display metadata provided."
            }
        } else {
            throw "No display metadata provided."
        }
    } else {
        throw "Invalid dom element."
    }
}
