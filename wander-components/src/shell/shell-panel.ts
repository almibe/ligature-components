import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import './shell.css';
import {provide} from '@lit/context';
import { ShellStore, shellStoreContext } from './shell-store.ts';
import { MobxLitElement } from '@adobe/lit-mobx';
import './shell-editor.ts'
import './shell-results.ts'

@customElement('shell-panel')
export class ShellPanel extends MobxLitElement {
  @provide({context: shellStoreContext})
  shellStore = new ShellStore();

  render() {
    return html`
        <div>
          <div class="container">
            <shell-editor></shell-editor>
          </div>
          <shell-results></shell-results>
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
