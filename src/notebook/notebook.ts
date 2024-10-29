import { Entry, Role, run } from "@ligature/ligature";
import { toGraph } from "@ligature/ligature"
import Graph from "graphology";

function getType(graph: Graph, node: string): "MarkdownCell" | "WanderCell" | null {
    graph.edges(node).forEach(edge => {
        const target = graph.target(edge)
        const attrs = graph.getEdgeAttributes(edge)
        if (attrs.type == "extension" && target == "MarkdownCell") {
            return "MarkdownCell"
        }
        if (attrs.type == "extension" && target == "WanderCell") {
            return "WanderCell"
        }
    })
    return null
}

function getSource(graph: Graph, node: string): string | null {
    graph.edges(node).forEach(edge => {
        const attrs = graph.getEdgeAttributes(edge)
        if (attrs.type == "role" && attrs.role == "source") {
            return graph.target(edge)
        }
    })
    return null
}

export function showNotebook(el: HTMLElement, network: Entry[]) {
    if (el == null) {
        throw "Illegal arg to showNotebook"
    }
    const graph = toGraph(network)
    let start: string | null = null;
    graph.forEachEdge((edgeKey) => {
        const source = graph.source(edgeKey)
        const target = graph.target(edgeKey)
        const attrs = graph.getEdgeAttributes(edgeKey)
        if (attrs.type == "extension" && target == 'NotebookStart') {
            start = source
        }
    })
    if (start != null) {
        let currentNode: string | null = start
        while (currentNode != null) {
            const div = document.createElement("div")
            const type = getType(graph, currentNode)
            console.log("type", type)
            if (type == "MarkdownCell") {
                const source = getSource(graph, currentNode)
                div.textContent = source
                el.appendChild(div)
            } else if (type == "WanderCell") {
    
            } else {
                throw "TODO"
            }

            currentNode = null
        }
    } else {
        const root = document.createElement("div")
        root.textContent = "Invalid network passed to showNotebook."
        el.appendChild(root)
    }
}

class LigatureNotebookComponent extends HTMLElement {
    constructor() {
      super();
      const el = document.createElement("div")
      el.classList.add('ligature-display-notebook')
      const script = this.textContent;
      this.textContent = "";
      showNotebook(el, run(script)["result"]);
      this.appendChild(el);
    }
}

if (!customElements.get('ligature-notebook')) {
    customElements.define('ligature-notebook', LigatureNotebookComponent);
}
