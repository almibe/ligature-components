import { LitElement, html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import { run, introspect } from '@wander-lang/wander';
import style from "prismjs/themes/prism-coy.css?inline";
import Prism from "prismjs";
import "prismjs/components/prism-sml"
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

@customElement('wander-lang')
export class WanderLang extends LitElement {
  render() {
    const action = this.attributes.getNamedItem("action");
    if (action == null ) {
      return html`<pre><code class="language-sml">${this.textContent!!}</code></pre>`
    } else if (action.value == "run") {
      return html`<pre>${JSON.stringify(run(this.textContent!!))}</pre>`
    } else if (action.value == "introspect") {
      return html`<pre>${JSON.stringify(introspect(this.textContent!!))}</pre>`
    } else if (action.value == "display") {
      const result = Prism.highlight(this.textContent, Prism.languages.sml);
      return html`<pre><code class="language-sml">${unsafeHTML(result)}</code></pre>`
    } else {
      throw new DOMException("Unknown Action " + action.value);
    }
  }

  static styles = unsafeCSS(style);
}

declare global {
  interface HTMLElementTagNameMap {
    'wander-lang': WanderLang
  }
}
