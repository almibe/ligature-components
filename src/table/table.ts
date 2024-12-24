import {TabulatorFull as Tabulator} from 'tabulator-tables'
import  "tabulator-tables/dist/css/tabulator.min.css"

function networkToTableData(network: any): any[] {
    let roles = new Set<string>()
    let results: any[] = []
    network.forEach((triple) => {
        let res = results.find((i:any) => i.element == triple[0].value)
        if (res == undefined) {
            const newEntry = {element: triple[0].value}
            newEntry[triple[1].value] = [triple[2].value]
            results.push(newEntry)
            roles.add(triple[1].value)
        } else {
            if (res[triple[1].value] != undefined) {
                res[triple[1].value].push(triple[2].value)
            } else {
                res[triple[1].value] = [triple[2].value]
            }
        }
    })

    //add all columns to the first row
    if (results[0] != undefined) {
        let value = results[0]
        roles.forEach((role) => {
            if (value[role] == undefined) {
                value[role] = []
            }
        })
    }
    return results
}

export function showTable(element: HTMLElement, network: any) {
    if (network.type == "network") {
        return new Tabulator(element, {
            data: networkToTableData(network.value),
            autoColumns: true
        })    
    } else {
        throw "unexpected value"
    }
}
