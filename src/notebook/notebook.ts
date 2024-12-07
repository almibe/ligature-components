import { Entry, Role, run } from "@ligature/ligature";
import { toGraph } from "@ligature/ligature"
import Graph from "graphology";
import markdownit from 'markdown-it'
const md = markdownit()

function getType(graph: Graph, node: string): "MarkdownCell" | "WanderCell" | null {
    let res = null
    graph.edges(node).forEach(edge => {
        const target = graph.target(edge)
        const attrs = graph.getEdgeAttributes(edge)
        if (attrs.type == "extension" && target == "MarkdownCell") {
            res = "MarkdownCell"
        }
        if (attrs.type == "extension" && target == "WanderCell") {
            res = "WanderCell"
        }
    })
    return res
}

function getSource(graph: Graph, node: string): string | null {
    let source = null
    graph.edges(node).forEach(edge => {
        const attrs = graph.getEdgeAttributes(edge)
        if (attrs.type == "role" && attrs.roleName == "source") {
            source = graph.target(edge)
        }
    })
    return source
}

function getNext(graph: Graph, node: string): string | null {
    let next = null
    graph.edges(node).forEach(edge => {
        const attrs = graph.getEdgeAttributes(edge)
        const source = graph.source(edge)
        if (source == node && attrs.type == "role" && attrs.roleName == "next") {
            next = graph.target(edge)
        }
    })
    return next
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
            const type = getType(graph, currentNode)
            if (type == "MarkdownCell") {
                const div = document.createElement("div")
                const source = getSource(graph, currentNode)
                div.innerHTML = md.render(source)
                el.appendChild(div)
            } else if (type == "WanderCell") {
                const display = document.createElement("ligature-display")
                display.innerText = getSource(graph, currentNode)
                el.appendChild(display)
            } else if (type == "NetworkCell") {
                throw "TODO"
            } else {
                throw "TODO"
            }
            currentNode = getNext(graph, currentNode)
        }
    } else {
        const root = document.createElement("div")
        root.textContent = "Invalid network passed to showNotebook."
        el.appendChild(root)
    }
}
