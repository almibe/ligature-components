import { LitElement, css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import './shell.css';
import { initializeEditor } from '../editor/wander-editor.ts';
import {provide} from '@lit/context';
import { ShellApi, createShellApi, shellApiContext } from './shell-api.ts';
import { ShellState, createShellState, shellStateContext } from './shell-state.ts';

@customElement('shell-panel')
export class ShellPanel extends LitElement {

  @query("#editor")
  editor;

  @provide({context: shellApiContext})
  shellApiContext: ShellApi = createShellApi();

  @provide({context: shellStateContext})
  shellStateContext: ShellState = createShellState();

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
    'shell-panel': ShellPanel
  }
}
