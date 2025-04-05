import Konva from "konva"
import { Arrow } from "konva/lib/shapes/Arrow"
import { Circle } from "konva/lib/shapes/Circle"

type Vertex = {
    shape: Circle,
    dx: number,
    dy: number
}

type Edge = {
    source: Vertex,
    label: string,
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

    for (const triple of network) {
        const sourceName = "term:" + triple[0].value
        const role = triple[1].value
        const valueType = triple[2].type + ":"
        const value = valueType + triple[2].value

        if (!vertices.has(sourceName)) {
            // const text = new Konva.Text({
            //     x: position.x + 5,
            //     y: position.y + 5,
            //     text: name
            // })
            // layer.add(layer.circle);  
            // layer.add(text);  
    
            const circle = new Konva.Circle({
                x: Math.random() * 400, 
                y: Math.random() * 400,
                radius: 5,
                fill: 'black',
                stroke: 'black',
                strokeWidth: 4,
            });
            vertices.set(sourceName, { shape: circle, dx: 0, dy: 0 })
        }
        if (!vertices.has(value)) {
            const circle = new Konva.Circle({
                x: Math.random() * 400, 
                y: Math.random() * 400,
                radius: 5,
                fill: 'black',
                stroke: 'black',
                strokeWidth: 4,
            });
            vertices.set(value, { shape: circle, dx: 0, dy: 0 })
        }

        const source = vertices.get(sourceName)
        const target = vertices.get(value)

        const arrow = new Konva.Arrow({
            x: 0,
            y: 0,
            points: [source.shape.x(), source.shape.y(), target.shape.x(), target.shape.y()],
            pointerLength: 20,
            pointerWidth: 20,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 4
        })

        edges.push({
            source: source,
            target: target,
            label: role,
            shape: arrow,
        })
    }
    return { vertices: vertices, edges: edges }
}

function layoutStep(graph: Graph, width, height) {
    const vertexNumber = graph.vertices.keys.length
    const numIterations = 1000
    const area = width * height
    const k = Math.sqrt(area / vertexNumber)
    const attract = (x: number) => x * x / k
    const repulse = (x: number) => k * k / x    
    let temp = 100
    const cool = (t: number) => t * 0.9
    
    // for (let iter = 0; iter < numIterations; iter++) {
    //     //repulsion force
    //     for (const [name, info] of Object.entries(layout)) {
    //         for (const [innerName, innerInfo] of Object.entries(layout)) {
    //             if (name != innerName) {
    //                 const deltaX = info.shape.x - innerInfo.shape.x
    //                 const deltaY = info.shape.y - innerInfo.shape.y

    //                 info.dx = info.dx + (deltaX/Math.abs(deltaX)) * repulse(Math.abs(deltaX))
    //                 info.dy = info.dy + (deltaY/Math.abs(deltaY)) * repulse(Math.abs(deltaY))
    //             }
    //         }    
    //     } 

    //     //attraction force
    //     for (const [name, info] of Object.entries(layout)) {
    //         for (const link of info.links) {
    //             const other = layout[link.to]
    //             const deltaX = info.shape.x - other.shape.x
    //             const deltaY = info.shape.y - other.shape.y

    //             info.dx = info.dx - (deltaX / Math.abs(deltaX)) * attract(Math.abs(deltaX))
    //             info.dy = info.dy - (deltaY / Math.abs(deltaY)) * attract(Math.abs(deltaY))
                
    //             other.dx = other.dx + (deltaX / Math.abs(deltaX)) * attract(Math.abs(deltaX))
    //             other.dy = other.dy + (deltaY / Math.abs(deltaY)) * attract(Math.abs(deltaY))
    //         }
    //     }

    //     //adjust values
    //     for (const [name, info] of Object.entries(layout)) {
    //         console.log(info)
    //         if (info.dx < -temp) {
    //             info.dx = -temp
    //         }
    //         if (info.dx > temp) {
    //             info.dx = temp
    //         }
    //         if (info.dy < -temp) {
    //             info.dy = -temp
    //         }
    //         if (info.dy > temp) {
    //             info.dy = temp
    //         }
    //         info.shape.x = info.shape.x + info.dx
    //         info.dx = 0
    //         info.shape.y = info.shape.y + info.dy
    //         info.dy = 0
    //         if (info.shape.x < 0) {
    //             info.shape.x = 0
    //         }
    //         if (info.shape.x > width) {
    //             info.shape.x = width
    //         }
    //         if (info.shape.y < 0) {
    //             info.shape.y = 0
    //         }
    //         if (info.shape.y > height) {
    //             info.shape.y = height
    //         }
    //     }
    //     temp = cool(temp)
    // }
}

function processNetwork(network) {
    let res = initialize(network)    
    layoutStep(res, 400, 400)

    return res
}

export function drawNetwork(element, network) {
    const newElement = document.createElement("div")
    const graph: Graph = processNetwork(network)
    const stage = new Konva.Stage({
        container: newElement,
        width: 400,
        height: 400,
    });
    const layer = new Konva.Layer();
  
    for (const [name, vertx] of graph.vertices.entries()) {
        layer.add(vertx.shape)
    }

    for (const edge of graph.edges) {
        layer.add(edge.shape)
    }
  
    stage.add(layer);
    element.appendChild(newElement)
}
