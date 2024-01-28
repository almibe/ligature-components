import { LitElement, css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import './shell.css';
import { Editor, initializeEditor } from '../editor/wander-editor.ts';
import { Results } from './shell-results.ts';

@customElement('shell-panel')
export class WanderShell extends LitElement {

  @query("#editor")
  editor;

//   bus.on("ClearEditor", () => {
//     editor.setText("");
//   })

//   bus.on("SetEditor", ({ script }) => {
//     editor.setText(script);
//   })

//         onRun: (script) => {
//           editor.setText("")
//           bus.emit("RunScript", { script });
//         },
//         onKey: (key, script, position) => {
//           if (key == "Enter") {
//             bus.emit("RunScript", { script });
//             setTimeout(() => editor.setText(""))
//           }


  render() {
    setTimeout(() => {
      console.log(this.editor)
      initializeEditor({
        element: this.editor,
        onRun: (script) => { console.log(script) },
        onKey(key, text, position) {
          console.log(key)
        },
      })
    });

    return html`
        <div>
          <div class="container">
            <div id="editor"></div>
          </div>
        </div>
        `
  }

  static styles = css`
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'wander-shell': WanderShell
  }
}
