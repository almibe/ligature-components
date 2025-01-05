export function printValue(value: any): string {
    let res = ""
    if (value.type == "network") {
        res = "{\n"
        for (let triple of value.value) {
            res += "  " + printValue(triple[0]) + " " + printValue(triple[1]) + " " + printValue(triple[2]) + ",\n"
        }
        res += "}"
    } else if (value.type == "element" || value.type == "slot" || value.type == "literal") {
        res += value.value
     } else {
        res = "???"
    }
    return res
}

export function showText(element: HTMLElement, value: any) {
    if (element != null) {
        element.replaceChildren()
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = printValue(value)
        element.appendChild(pre)
    }
}
