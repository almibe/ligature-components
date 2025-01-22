import cytoscape from "cytoscape"

function translateNetwork(network) {
    const results = []
    const nodes = new Set()
    let id = 0

    network.forEach((triple) => {
            results.push({data: {id: "id" + (++id), label: triple.role.value, source: triple.element.value, target: triple.value.value}})
            nodes.add(triple.element.value)
            nodes.add(triple.value.value)
    })

    nodes.forEach((node) => {
        results.push({data: {id: node}})
    })

    return results
}

export function appendGraph(element, network) {
    let newElement = document.createElement("div")
    newElement.classList.add("graph")
    element.appendChild(newElement)
    return cytoscape({
        container: newElement,
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
                    'curve-style': 'bezier',
                    'width': 3,
                    label: 'data(label)',
                    'target-arrow-shape': 'triangle',
                }
            }
        ]
        });    
}
