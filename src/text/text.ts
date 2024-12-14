export function printGraph(graph: any): string {
    let res = ""
    if (graph.entries != undefined) {
        for (const entry of graph.entries) {
            res += entry.first + " " + entry.second + " " + entry.third + ",\n"
        }    
    } else {
        res = graph
    }
    return res
}

export function showText(element: HTMLElement, network: any) {
    if (element != null) {
        element.replaceChildren()
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = printGraph(network)
        element.appendChild(pre)
    }
}
