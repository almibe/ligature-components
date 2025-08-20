import {TabulatorFull as Tabulator} from 'tabulator-tables'
import  "tabulator-tables/dist/css/tabulator.min.css"
import type { ElementView } from "@ligature/ligature";

type TableData = {
    headers: string[],
    data: Map<string, string>
}

function createTable(tableData: TableData) {
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

function processNetwork(network: ElementView[]): TableData {
    const columns = new Set<string>();
    const data = new Map<string, Map<string, string>>()
    for (let ev of network) {
        Object.keys(ev.links).forEach((value) => columns.add(value))
        if (data.has(ev.value)) {
            const entry: Map<string, string> = data.get(ev.value)!
            Object.keys(ev.links).forEach((role) => {
                if (entry.has(role)) {
                    const values: string = entry.get(role)!
                    values + ", " + (ev.links[role])
                } else {
                    const values = ev.links[role].reduce((state, value) => {
                        return state + ", " + value.value
                    }, "")
                    entry.set(role, values)
                }
            })
        } else {
            const entry = new Map()
            Object.keys(ev.links).forEach((role) => {
                entry.set(role, ev.links[role].reduce((state, value) => {
                        if (state == "") {
                            return value.value
                        } else {
                            return state + ", " + value.value
                        }
                    }, ""))
            })
            data.set(ev.value, entry)
        }
    }
    let headers: string[] = ["element", ...columns]
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

export function appendTable(network: ElementView[], element: HTMLElement) {
    let tableData = processNetwork(network)
    let newElement = document.createElement("div")
    element.appendChild(newElement)
    let table = createTable(tableData)
    newElement.appendChild(table)
    return new Tabulator(table)
}
