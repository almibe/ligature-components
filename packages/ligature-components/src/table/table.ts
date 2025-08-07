import { ElementView } from "@ligature/ligature"
import {TabulatorFull as Tabulator} from 'tabulator-tables'
import  "tabulator-tables/dist/css/tabulator.min.css"

function createTable(tableData) {
    const table = document.createElement('table')
    const head = table.createTHead()
    const body = table.createTBody()
    const hRow = head.insertRow()
    for (const header of tableData.headers) {
        const th = document.createElement("th")
        th.textContent = header
        hRow.appendChild(th)    
    }
    for (const row of tableData.data) {
        const tr = body.insertRow()
        for (const value of row) {
            const td = tr.insertCell()
            td.appendChild(document.createTextNode(value))
        }
    }
    return table
}

function processNetwork(network: ElementView[]) {
    const columns = new Set();
    const data = new Map()
    // for (let triple of network) {
    //     columns.add(triple[1].value)
    //     if (data.has(triple[0].value)) {
    //         const entry = data.get(triple[0].value)
    //         if (entry.has(triple[1].value)) {
    //             const values = entry.get(triple[1].value)
    //             values.push(triple[2].value)
    //         } else {
    //             const values = [triple[2].value]
    //             entry.set(triple[1].value, values)
    //         }
    //     } else {
    //         const entry = new Map()
    //         const values = [triple[2].value]
    //         entry.set(triple[1].value, values)
    //         data.set(triple[0].value, entry)
    //     }
    // }
    let headers = ["element", ...columns]
    let result = []

    for (const [name, values] of data) {
        let row = [name]
        for (const header of headers) {
            if (header != "element") {
                if (values.has(header)) {
                    row.push(values.get(header))    
                } else {
                    row.push("")
                }
            }
        }
        result.push(row)
    }

    return { headers: headers, data: result }
}

export function appendTable(network: ElementView[], element) {
    let tableData = processNetwork(network)
    let newElement = document.createElement("div")
    element.appendChild(newElement)
    let table = createTable(tableData)
    newElement.appendChild(table)
    return new Tabulator(table)
}
