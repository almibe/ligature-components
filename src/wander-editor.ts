import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { run, introspect } from '@wander-lang/wander';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"

@customElement('wander-editor')
export class WanderEditor extends LitElement {
  @query('#editor')
  _editorNode: Element;

  render() {
    return html`
      <div id="editor" class="code">Editor</div>
    `
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.initializeEditor(() => {}, () => {});
  }

  static styles = css``;

  async initializeEditor(setText, run) {
    await this.updateComplete;
    let inputEditor: EditorView;
    let runEvent;
  
    inputEditor = new EditorView({
      extensions: [
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
            setText(v.state.doc.toString())
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
