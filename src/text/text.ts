import { Entry, run } from "@ligature/ligature";

export function printNetwork(result: Entry[]): string {
    let res = "{\n"
    for (let entry of result) {
        if (entry.type == "extension") {
            res += "  " + entry.element.symbol + " : " + entry.concept.symbol + ",\n"
        } else if (entry.type == "nonextension") {
            res += "  " + entry.element.symbol + " :¬ " + entry.element.symbol + ",\n"
        } else {
            res += "  " + entry.first.symbol + " " + entry.role.symbol + " " + entry.second.symbol + ",\n"
        }
    }
    return res + "}"
}

export function showText(element: HTMLElement, network: Entry[]) {
    if (element != null) {
        element.replaceChildren()
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = printNetwork(network)
        element.appendChild(pre)
    }
}
