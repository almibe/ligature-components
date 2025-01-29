import { printAny, printStack } from "@ligature/ligature"

export function appendText(element, value) {
    if (element != null) {
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = printAny(value)
        element.appendChild(pre)
    }
}

export function appendStackText(element, stack) {
    if (element != null) {
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = printStack(stack)
        element.appendChild(pre)
    }
}
