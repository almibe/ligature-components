import { css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import './shell.css';
import { Editor, initializeEditor } from '../editor/wander-editor.ts';
import {consume} from '@lit/context';
import { ShellStore, shellStoreContext } from './shell-store.ts';
import { MobxLitElement } from '@adobe/lit-mobx';
import { autorun } from 'mobx';

@customElement('shell-editor')
export class ShellEditor extends MobxLitElement {

  @consume({context: shellStoreContext})
  shellStore!: ShellStore

  @query("#editor")
  editor!: HTMLElement;

  editorObj: Editor | null = null

  render() {
    autorun(() => { 
      if (this.shellStore.script != this.editorObj?.readText()) {
        if (this.editorObj != null) {
          this.editorObj.setText(this.shellStore.script);
        }
      }
    });

    const that = this;
    setTimeout(() => {
      this.editorObj = initializeEditor({
        element: this.editor,
        onRun: (script) => {
          this.shellStore.runEditor();
        },
        onChange(text) {
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
