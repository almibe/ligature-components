export function showText(element, value) {
    if (element != null) {
        element.replaceChildren()
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        pre.appendChild(code)
        code.textContent = JSON.stringify(value)
        element.appendChild(pre)
    }
}
