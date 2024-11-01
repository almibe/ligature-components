import { Entry, run } from "@ligature/ligature";
import cytoscape from "cytoscape"

function translateNetwork(network: Entry[]): any[] {
    const results: any[] = []
    const nodes = new Set<string>()
    let id = 0

    network.forEach((entry) => {
        if (entry.type == "extension") {
            nodes.add(entry.element.symbol)
            nodes.add(entry.concept.symbol)
            results.push({data: {id: "extends::" + (++id), label: "extends", source: entry.element.symbol, target: entry.concept.symbol}})
        } else if (entry.type == "nonextension") {
            nodes.add(entry.element.symbol)
            nodes.add(entry.concept.symbol)
            results.push({data: {id: "extendsNot::" + (++id), label: "extendsNot", source: entry.element.symbol, target: entry.concept.symbol}})
        } else {
            nodes.add(entry.first.symbol)
            nodes.add(entry.second.symbol)
            results.push({data: {id: entry.role.symbol + "::" + (++id), label: entry.role.symbol, source: entry.first.symbol, target: entry.second.symbol}})
        }
    })

    nodes.forEach((node) => {
        results.push({data: {id: node}})
    })

    return results
}

export function showGraph(element: HTMLElement, network: Entry[]) {
    return cytoscape({
        container: element,
        elements: translateNetwork(network),
        style: [
            {
                selector: 'node',
                style: {
                    label: 'data(id)'
                }
            },
            {
                selector: 'edge',
                style: {
                    label: 'data(label)'
                }
            }
        ]
      });    
}
