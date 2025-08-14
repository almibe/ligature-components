import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as ace from "ace-builds/src/ace.js"

@customElement('wander-editor')
export class WanderEditor extends LitElement {

  createRenderRoot() {
    return this; 
  }

  render() {
    setTimeout(() => {
      var editor = ace.edit(document.querySelector("#editor"))
      editor.setValue("replace me")
    })
    return html`
      :host {
        display: block;
        padding: 10px;
      }

      <div id="editor">
        Test
      </div>
    `
  }

  static styles = css`
    display: block;
    height: 400px;
    width: 90%
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'wander-editor': WanderEditor
  }
}
