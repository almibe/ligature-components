import { Entry } from '@ligature/ligature'
import {TabulatorFull as Tabulator} from 'tabulator-tables'
import  "tabulator-tables/dist/css/tabulator.min.css"

function networkToTableData(network: Entry[]): any[] {
    let results: any[] = []
    network.forEach((entry) => {
        if (entry.type == "extension") {
            let res = results.find((i:any) => i.element == entry.element)
            if (res == undefined) {
                results.push({element: entry.element.symbol, extends: [entry.concept.symbol]})
            } else {
                if (res.extends != undefined) {
                    res.extends.push(entry.concept.symbol)
                } else {
                    res.extends = [entry.concept.symbol]
                }
            }
        } else if (entry.type == "nonextension") {
            let res = results.find((i:any) => i.element == entry.element)
            if (res == undefined) {
                results.push({element: entry.element.symbol, extendsNot: [entry.concept.symbol]})
            } else {
                if (res.extendsNot != undefined) {
                    res.extends.push(entry.concept.symbol)
                } else {
                    res.extendsNot = [entry.concept.symbol]
                }
            }
        } else {
            let res = results.find((i:any) => i.element = entry.first)
            if (res == undefined) {
                const newEntry = {element: entry.first.symbol}
                newEntry[entry.role.symbol] = [entry.second.symbol]
                results.push(newEntry)
            } else {
                if (res[entry.role.symbol] != undefined) {
                    res[entry.role.symbol].push(entry.second.symbol)
                } else {
                    res[entry.role.symbol] = entry.second.symbol
                }
            }
        }
    })
    return results
}

export function showTable(elementSelector: string, network: Entry[]) {
    return new Tabulator(elementSelector, {
        data: networkToTableData(network),
        autoColumns: true
    })
}
