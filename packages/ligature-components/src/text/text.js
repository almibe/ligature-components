import { printValue, printResult } from "@ligature/ligature"

export function appendText(element, value) {
    if (element != null) {
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = printValue(value)
        element.appendChild(pre)
    }
}

export function appendStackText(element, stack) {
    if (element != null) {
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        console.log("Stack", stack)
        console.log("Result", printStack(stack))
        code.textContent = printStack(stack)
        element.appendChild(pre)
    }
}
