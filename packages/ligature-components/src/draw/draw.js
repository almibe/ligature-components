import Konva from "konva"

function processNetwork(network) {
    let res = {}

    for (const triple of network) {
        const source = triple[0].value
        const role = triple[1].value
        const value = triple[2].value

        if (res[source] == undefined) {
            res[source] = { x: Math.random() * 400, y: Math.random() * 400, links: [
                { to: value, label: role }
            ] }
        } else {
            let links = res[source].links
            links.push({ to: value, label: role })
            res[source].links = links
        }

        if (res[value] == undefined) {
            res[value] = { x: Math.random() * 400, y: Math.random() * 400, links: [] }
        }
    }
    return res
}

export function drawNetwork(element, network) {
    const newElement = document.createElement("div")

    const positions = processNetwork(network)

    const stage = new Konva.Stage({
        container: newElement,
        width: 400,
        height: 400,
    });
  
    const layer = new Konva.Layer();
  
    for (const [name, position] of Object.entries(positions)) {
        const circle = new Konva.Circle({
            x: position.x,
            y: position.y,
            radius: 5,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 4,
        });

        const text = new Konva.Text({
            x: position.x + 5,
            y: position.y + 5,
            text: name
        })
      
        for (const link of position.links) {
            const target = positions[link.to]
            console.log("target", target)
            console.log("position", position)
            const arrow = new Konva.Arrow({
                x: 0,
                y: 0,
                points: [position.x, position.y, target.x, target.y],
                pointerLength: 20,
                pointerWidth: 20,
                fill: 'black',
                stroke: 'black',
                strokeWidth: 4
            })

            layer.add(arrow)
        }

        layer.add(circle);  
        layer.add(text);  
    }
  
    stage.add(layer);
    element.appendChild(newElement)
}
