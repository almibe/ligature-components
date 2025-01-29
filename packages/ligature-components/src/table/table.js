import {TabulatorFull as Tabulator} from 'tabulator-tables'
import  "tabulator-tables/dist/css/tabulator.min.css"

function networkToTableData(network) {
    const columns = {}
    const data = new Map()
    for (let triple of network) {
        columns[triple[1].value] = []
        if (data.has(triple[0].value)) {
            const entry = data.get(triple[0].value)
            if (entry.has(triple[1].value)) {
                const values = entry.get(triple[1].value)
                values.push(triple[2].value)
            } else {
                const values = [triple[2].value]
                entry.set(triple[1].value, values)
            }
        } else {
            const entry = new Map()
            const values = [triple[2].value]
            entry.set(triple[1].value, values)
            data.set(triple[0].value, entry)
        }
    }
    let result = []
    data.forEach((entries, element) => {
        const id = {id : element }
        const e = Object.fromEntries(entries)
        result.push({...id, ...columns, ...e})
    })
    return result
}

export function appendTable(element, network) {
    let newElement = document.createElement("div")
    element.appendChild(newElement)
    return new Tabulator(newElement, {
        data: networkToTableData(network),
        autoColumns: true
    })    
}
