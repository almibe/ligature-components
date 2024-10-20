import {EditorView, basicSetup} from "codemirror"

export function showEditor(elementSelector: string, content) {
    const view = new EditorView({
        extensions: [basicSetup],
        parent: document.querySelector(elementSelector)
    })
    view.dispatch({
        changes: {from: 0, to: view.state.doc.length, insert: content}
    });
    return view
}
