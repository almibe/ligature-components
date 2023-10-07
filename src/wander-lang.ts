import { run, introspect } from '@wander-lang/wander';
import { LitElement, html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/sml';
import 'highlight.js/styles/default.css';

hljs.registerLanguage('sml', javascript);

@customElement('wander-lang')
export class WanderLang extends LitElement {
  createRenderRoot() {
    return this;
  }
  
  render() {
    const action = this.attributes.getNamedItem("action");
    if (action == null ) {
      const result = hljs.highlight(
        this.textContent,
        { language: 'sml' }
      ).value;
      return html`<pre><code class="language-sml">${unsafeHTML(result)}</code></pre>`
    } else if (action.value == "run") {
      return html`<pre>${JSON.stringify(run(this.textContent!!))}</pre>`
    } else if (action.value == "introspect") {
      return html`<pre>${JSON.stringify(introspect(this.textContent!!))}</pre>`
    } else if (action.value == "display") {
      const result = hljs.highlight(
        this.textContent,
        { language: 'sml' }
      ).value;
      return html`<pre><code class="language-sml">${unsafeHTML(result)}</code></pre>`
    } else {
      throw new DOMException("Unknown Action " + action.value);
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'wander-lang': WanderLang
  }
}
