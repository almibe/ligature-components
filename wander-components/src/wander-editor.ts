import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { language } from '@codemirror/language';
import { WanderLanguage } from './wander-code-mirror';

export interface Editor {
  readText(): string
  setText(text: string): void
}

export interface EditorConfig {
  readonly elementId: string
  readonly onRun: (text: string) => {}
  readonly onKey: (key: string, text: string, position: number) => {}
}

export function initializeEditor(config: EditorConfig): Editor {
  let inputEditor: EditorView;
  const element = document.getElementById(config.elementId)
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
      EditorView.domEventHandlers({
        keydown: (e, v) => {
          if((e.code == "Enter") && (e.metaKey || e.ctrlKey)) {
            config.onRun(v.state.doc.toString());
            e.preventDefault();
          } else {
            config.onKey(e.key, v.state.doc.toString(), v.state.selection.main.anchor)
          }
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
