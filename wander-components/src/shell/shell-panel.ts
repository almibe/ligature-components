import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import './shell.css';
import {provide} from '@lit/context';
import { ShellState, shellStoreContext } from './shell-state.ts';
import './shell-editor.ts'
import './shell-results.ts'
import { rawTextApplet, errorApplet, inspectionApplet, htmlApplet, textApplet } from './applets.ts';

@customElement('shell-panel')
export class ShellPanel extends LitElement {
  @provide({context: shellStoreContext})
  shellStore = new ShellState();

  constructor() {
    super()
    this.shellStore.addApplet(errorApplet);
    this.shellStore.addApplet(rawTextApplet);
    this.shellStore.addApplet(inspectionApplet);
    this.shellStore.addApplet(htmlApplet);
    this.shellStore.addApplet(textApplet);
  }

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
