import { Entry } from "@ligature/ligature";
import cytoscape from "cytoscape"

function translateNetwork(network: Entry[]): any[] {
    const results: any[] = []
    const nodes = new Set<string>()


    network.forEach((entry) => {
        if (entry.type == "extension") {
            //todo add concept labels
        } else if (entry.type == "nonextension") {
            //todo add concept labels
        } else {
            nodes.add(entry.first.symbol)
            nodes.add(entry.second.symbol)
            results.push({data: {id: entry.role.symbol, source: entry.first.symbol, target: entry.second.symbol}})
        }
    })
    // return [
    //     { data: { id: 'a' } },
    //     { data: { id: 'b' } },
    //     {
    //       data: {
    //         id: 'ab',
    //         source: 'a',
    //         target: 'b'
    //       }
    //     }]

    nodes.forEach((node) => {
        results.push({data: {id: node}})
    })

    return results
}

export function showGraph(elementSelector: string, network: Entry[]) {
    return cytoscape({
        container: document.querySelector(elementSelector),
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
                    label: 'data(id)'
                }
            }
        ]
      });    
}
