import * as ace from "ace-builds/src/ace.js"

export function showEditor(element) {
    var editor = ace.edit(element)
    return editor
}
