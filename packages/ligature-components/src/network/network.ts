import Konva from "konva"
import { Arrow } from "konva/lib/shapes/Arrow"
import { Circle } from "konva/lib/shapes/Circle"
import { Text } from "konva/lib/shapes/Text"

type Vertex = {
    shape: Circle,
    label: Text,
    dx: number,
    dy: number
}

type Edge = {
    source: Vertex,
    label: Text,
    target: Vertex,
    shape: Arrow
}

type Graph = {
    vertices: Map<string, Vertex>
    edges: Array<Edge>
}

function initialize(network): Graph {
    let vertices: Map<string, Vertex> = new Map()
    let edges: Array<Edge> = []
    let graph: Graph = { vertices: vertices, edges: edges }
    for (const triple of network) {
        const sourceName = "term:" + triple[0].value
        const role = triple[1].value
        const valueType = triple[2].type + ":"
        const value = valueType + triple[2].value

        if (!vertices.has(sourceName)) {
            const x = Math.random() * 400
            const y = Math.random() * 400
            const text = new Konva.Text({
                x: x + 5,
                y: y + 5,
                text: triple[0].value
            })
    
            const circle = new Konva.Circle({
                x: x, 
                y: y,
                radius: 3,
                fill: 'gray',
                stroke: 'gray',
                strokeWidth: 3,
                draggable: true,
            });
            circle.on('dragend', () => {
                layoutStep(graph, 400, 400)
            })
            vertices.set(sourceName, { shape: circle, label: text, dx: 0, dy: 0 })
        }
        if (!vertices.has(value)) {
            const x = Math.random() * 400
            const y = Math.random() * 400
            const text = new Konva.Text({
                x: x + 5,
                y: y + 5,
                text: triple[2].value
            })

            const circle = new Konva.Circle({
                x: Math.random() * 400, 
                y: Math.random() * 400,
                radius: 3,
                fill: 'gray',
                stroke: 'gray',
                strokeWidth: 3,
                draggable: true,
            });
            circle.on('dragend', () => {
                layoutStep(graph, 400, 400)
            })
            vertices.set(value, { shape: circle, label: text, dx: 0, dy: 0 })
        }

        const source = vertices.get(sourceName)!
        const target = vertices.get(value)!

        const arrow = new Konva.Arrow({
            x: 0,
            y: 0,
            points: [source.shape.x(), source.shape.y(), target.shape.x(), target.shape.y()],
            pointerLength: 10,
            pointerWidth: 10,
            fill: 'gray',
            stroke: 'gray',
            strokeWidth: 3
        })

        const text = new Konva.Text({
            x: 0,
            y: 0,
            text: role
        })

        edges.push({
            source: source,
            target: target,
            label: text,
            shape: arrow,
        })
    }
    return graph
}

function layoutStep(graph: Graph, width: number, height: number) {
    const vertexNumber = graph.vertices.size
    const numIterations = 100
    const area = width * height
    const k = Math.sqrt(area / vertexNumber)
    const attract = (x: number) => x * x / k
    const repulse = (x: number) => k * k / x    
    let temp = 50
    const cool = (t: number) => t * 0.8
    
    for (let iter = 0; iter < numIterations; iter++) {
        //repulsion force
        for (const [name, info] of graph.vertices.entries()) {
            for (const [innerName, innerInfo] of graph.vertices.entries()) {
                if (name != innerName) {
                    const deltaX = info.shape.x() - innerInfo.shape.x()
                    const deltaY = info.shape.y() - innerInfo.shape.y()

                    info.dx = info.dx + (deltaX/Math.abs(deltaX)) * repulse(Math.abs(deltaX))
                    info.dy = info.dy + (deltaY/Math.abs(deltaY)) * repulse(Math.abs(deltaY))

                    console.log(name, info.dx, info.dy)

                }
            }    
        } 

        // attraction force
        for (const edge of graph.edges) {
            const source = edge.source
            const target = edge.target
            const deltaX = source.shape.x() - target.shape.x()
            const deltaY = source.shape.y() - target.shape.y()

            source.dx = source.dx - (deltaX / Math.abs(deltaX)) * attract(Math.abs(deltaX))
            source.dy = source.dy - (deltaY / Math.abs(deltaY)) * attract(Math.abs(deltaY))
            
            target.dx = target.dx + (deltaX / Math.abs(deltaX)) * attract(Math.abs(deltaX))
            target.dy = target.dy + (deltaY / Math.abs(deltaY)) * attract(Math.abs(deltaY))
        }

        //adjust values
        for (const [name, info] of graph.vertices.entries()) {
            console.log("debug", name, info)
            if (info.dx < -temp) {
                info.dx = -temp
            }
            if (info.dx > temp) {
                info.dx = temp
            }
            if (info.dy < -temp) {
                info.dy = -temp
            }
            if (info.dy > temp) {
                info.dy = temp
            }
            info.shape.x(info.shape.x() + info.dx)
            info.dx = 0
            info.shape.y(info.shape.y() + info.dy)
            info.dy = 0
            const padding = 25
            if (info.shape.x() < padding) {
                info.shape.x(padding)
            }
            if (info.shape.x() > (width - padding)) {
                info.shape.x(width - padding)
            }
            if (info.shape.y() < padding) {
                info.shape.y(padding)
            }
            if (info.shape.y() > (height - padding)) {
                info.shape.y(height - padding)
            }
            info.label.x(info.shape.x() + 5)
            info.label.y(info.shape.y() + 5)            
        }

        //adjust edges
        for (const edge of graph.edges) {
            edge.shape.points([edge.source.shape.x(), edge.source.shape.y(), edge.target.shape.x(), edge.target.shape.y()])
            const x = (edge.source.shape.x() + edge.target.shape.x()) / 2
            const y = (edge.source.shape.y() + edge.target.shape.y()) / 2
            edge.label.x(x + 5)
            edge.label.y(y + 5)
        }

        temp = cool(temp)
    }
}

function processNetwork(network) {
    let res = initialize(network)
    return res
}

export function appendNetwork(element, network) {
    const newElement = document.createElement("div")
    const graph: Graph = processNetwork(network)
    const stage = new Konva.Stage({
        container: newElement,
        width: 400,
        height: 400,
    });
    const layer = new Konva.Layer();
  
    for (const edge of graph.edges) {
        layer.add(edge.shape)
        layer.add(edge.label)
    }
  
    for (const [name, vertx] of graph.vertices.entries()) {
        layer.add(vertx.shape)
        layer.add(vertx.label)
    }

    stage.on('click', () => {
        layoutStep(graph, 400, 400)
    })

    layoutStep(graph, 400, 400)

    stage.add(layer);
    element.appendChild(newElement)
}
