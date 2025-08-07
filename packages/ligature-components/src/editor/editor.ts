import * as ace from "ace-builds/src/ace.js"

export function showEditor(element, content) {
    var editor = ace.edit(element)
    editor.setValue(content)
    return editor
}