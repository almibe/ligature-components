import { printValue } from "@ligature/ligature"

export function appendText(element, value) {
    if (element != null) {
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = printValue(value)
        element.appendChild(pre)
    }
}
