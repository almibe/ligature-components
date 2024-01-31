import { css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import './shell.css';
import { initializeEditor } from '../editor/wander-editor.ts';
import {consume} from '@lit/context';
import { ShellStore, shellStoreContext } from './shell-store.ts';
import { MobxLitElement } from '@adobe/lit-mobx';

@customElement('shell-editor')
export class ShellEditor extends MobxLitElement {

  @consume({context: shellStoreContext})
  shellStore!: ShellStore

  @query("#editor")
  editor!: HTMLElement;

  render() {
    const that = this;
    setTimeout(() => {
      initializeEditor({
        element: this.editor,
        onRun: (script) => {
          this.shellStore.runEditor();
        },
        onKey(key, text, position) {
          that.shellStore.setScript(text);
        },
      })
    });

    return html`
          <div id="editor"></div>
        `
  }

  static styles = css`
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'shell-editor': ShellEditor
  }
}
