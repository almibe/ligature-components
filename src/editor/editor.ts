import { EditorState } from "@codemirror/state"
import {EditorView, basicSetup} from "codemirror"

export function showEditor(elementSelector: string, content) {
    const view = new EditorView({
        extensions: [basicSetup],
        parent: document.querySelector(elementSelector)
    })      
    view.setState(EditorState.create({doc: content}))
    return view
}
