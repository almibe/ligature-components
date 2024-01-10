import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { language } from '@codemirror/language';
import { WanderLanguage } from './wander-code-mirror';

interface Editor {
  readText(): string
  setText(text: string): void
}

export function initializeEditor(id): Editor {
  let inputEditor: EditorView;
  const element = document.getElementById(id)
  const script = element.innerText;
  element.innerText = "";
  inputEditor = new EditorView({
    doc: script,
    extensions: [
      language.of(WanderLanguage),
      EditorView.theme({
        "&": {height: "100%", overflow: "auto", resize: "verticle"},
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
  
  return {
    readText: () => inputEditor.state.doc.toString(),
    setText: (text: string) => inputEditor.state.doc = text
  };
}
