import { Entry, Role, run } from "@ligature/ligature";
import { showText } from "../text/text";
import { showTable } from "../table/table";
import { showGraph } from "../graph/graph";

export function defaultDisplays(): Map<string, (element: HTMLElement, network: Entry[]) => void> {
    const displays = new Map()
    displays.set('text', showText)
    displays.set('graph', showGraph)
    displays.set('table', showTable)
    return displays
}

export function display(el: HTMLElement, content: any, displays: Map<string, (element: HTMLElement, network: Entry[]) => void>) {
    if (el != null) {
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

class LigatureDisplayComponent extends HTMLElement {
    constructor() {
      super();
      const el = document.createElement("div")
      const script = this.textContent;
      this.textContent = "";
      this.appendChild(el);
      display(el, run(script), defaultDisplays());
    }
}

customElements.define('ligature-display', LigatureDisplayComponent);
