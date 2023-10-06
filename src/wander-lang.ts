import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { run } from '@wander-lang/wander';

@customElement('wander-lang')
export class WanderLang extends LitElement {
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  render() {
    return html`
      <pre>${JSON.stringify(run(this.textContent!!))}</pre>
    `
  }

  static styles = css`
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'wander-lang': WanderLang
  }
}
