import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { language } from '@codemirror/language';
import { WanderLanguage } from './wander-code-mirror';

initializeEditor("editor", "x = 6")

export function initializeEditor(id, text) {
  let inputEditor: EditorView;
  const element = document.getElementById(id)
  inputEditor = new EditorView({
    doc: text,
    extensions: [
      language.of(WanderLanguage),
      EditorView.theme({
        "&": {height: "300px", overflow: "auto", resize: "vertical"},
        ".cm-scroller": {overflow: "auto"}
      }),
      EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
          //this.text = v.state.doc.toString();
        }
      }),
      basicSetup,
      keymap.of([indentWithTab]), 
      ],
      parent: element,
    });
    inputEditor.focus();
}
