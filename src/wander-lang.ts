import { run, introspect } from '@wander-lang/wander';
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

@customElement('wander-lang')
export class WanderLang extends LitElement {
  createRenderRoot() {
    return this;
  }
  
  render() {
    const action = this.attributes.getNamedItem("action");
    if (action == null || action.value == "display") {
      const result = highlight(this.textContent!!);
      return html`<pre><code class="language-sml">${unsafeHTML(result)}</code></pre>`
    } else if (action.value == "run") {
      return html`<pre>${JSON.stringify(run(this.textContent!!))}</pre>`
    } else if (action.value == "introspect") {
      return html`<pre>${JSON.stringify(introspect(this.textContent!!))}</pre>`
    } else {
      throw new DOMException("Unknown Action " + action.value);
    }
  }
}

function highlight(input: string): string {
  return input;
}

declare global {
  interface HTMLElementTagNameMap {
    'wander-lang': WanderLang
  }
}
