import { printResult } from "@ligature/ligature"

export function appendText(element, value) {
    if (element != null) {
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = printResult(value)
        element.appendChild(pre)
    }
}
