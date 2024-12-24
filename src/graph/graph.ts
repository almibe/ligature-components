import cytoscape from "cytoscape"

function translateNetwork(network: any): any[] {
    const results: any[] = []
    const nodes = new Set<string>()
    let id = 0

    network.forEach((triple) => {
        // if (entry.type == "extension") {
        //     nodes.add(entry.element.symbol)
        //     nodes.add(entry.concept.symbol)
            results.push({data: {id: "id" + (++id), label: triple[1].value, source: triple[0].value, target: triple[2].value}})
        // } else if (entry.type == "nonextension") {
            nodes.add(triple[0].value)
            nodes.add(triple[2].value)
        //    results.push({data: {id: "extendsNot::" + (++id), label: "extendsNot", source: entry.element.symbol, target: entry.concept.symbol}})
        // } else {
        //     nodes.add(entry.first.symbol)
        //     nodes.add(entry.second.symbol)
        //    results.push({data: {id: entry.role.symbol + "::" + (++id), label: entry.role.symbol, source: entry.first.symbol, target: entry.second.symbol}})
        // }
    })

    nodes.forEach((node) => {
        results.push({data: {id: node}})
    })

    return results
}

export function showGraph(element: HTMLElement, network: any) {
    if (network.type == "network") {
        return cytoscape({
            container: element,
            elements: translateNetwork(network.value),
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
    } else {
        throw "unexpected value"
    }
}
