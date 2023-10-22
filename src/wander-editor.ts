import { LitElement, css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { run } from '@wander-lang/wander';
import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { language } from '@codemirror/language';
import { WanderLanguage } from './wander-code-mirror';

@customElement('wander-editor')
export class WanderEditor extends LitElement {
  @query('#editor')
  _editorNode: Element;

  @property()
  text: string = "";

  render() {
    return html`<div id="editor" class="code"></div>`
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.text = this.textContent!!;
    this.textContent = "";
    this.initializeEditor();
  }

  static styles = css``;

  async initializeEditor() {
    await this.updateComplete;
    let inputEditor: EditorView;
    let runEvent;
  
    inputEditor = new EditorView({
      doc: this.text,
      extensions: [
        language.of(WanderLanguage),
        EditorView.theme({
          "&": {height: "300px", overflow: "auto", resize: "vertical"},
          ".cm-scroller": {overflow: "auto"}
        }),
        EditorView.domEventHandlers({
          keydown: e => {
            if((e.code == "Enter") && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
            }
          }
        }),
        EditorView.updateListener.of((v: ViewUpdate) => {
          if (v.docChanged) {
            this.text = v.state.doc.toString();
          }
        }),
        basicSetup,
        keymap.of([indentWithTab]), 
        ],
        parent: this._editorNode,
      });
      inputEditor.focus();
      runEvent = (e) => {
        if((e.code == "Enter") && (e.metaKey || e.ctrlKey)) {
            run(inputEditor.state.doc.toString());
        }
      };
      runEvent = document.body.addEventListener('keydown', runEvent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wander-editor': WanderEditor
  }
}
