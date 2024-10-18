import { Entry } from "@ligature/ligature";
import {Springy, Graph} from "./springy.js";
import {springy } from "./springyui.js";

function translateNetwork(network: Entry[]): any {
    let result = {
		"nodes": [],
		"edges": []
	}

    network.forEach((entry) => {
        if (entry.type == "extension") {
            //todo mark concepts
        } else if (entry.type == "nonextension") {
            //todo mark concepts
        } else {
            if (!result.nodes.includes(entry.first.symbol)) {
                result.nodes.push(entry.first.symbol)
            }
            if (!result.nodes.includes(entry.second.symbol)) {
                result.nodes.push(entry.second.symbol)
            }
            result.edges.push([entry.first.symbol, entry.second.symbol])
        }
    })

    return result

    // return {
	// 	"nodes": [
	// 		"center",
	// 		"left",
	// 		"right",
	// 		"up",
	// 		"satellite"
	// 	],
	// 	"edges": [
	// 		["center", "left"],
	// 		["center", "right"],
	// 		["center", "up"]
	// 	]
	// }
}

export function showGraph(elementSelector: string, network: Entry[]) {
   let graph = new Graph();

    graph.loadJSON(translateNetwork(network));

    springy(document.querySelector(elementSelector), {
        graph: graph,
        nodeSelected: function(node){
            //console.log('Node selected: ' + JSON.stringify(node.data));
        }
    });
}
