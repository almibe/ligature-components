import { execute, highlight } from '@wander-lang/wander';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wander-code')
export class WanderCode extends LitElement {
  createRenderRoot() {
    return this;
  }
  
  @property()
  declare script: string;

  constructor() {
    super();
    this.script = "";
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.script = this.textContent!!;
    this.textContent = "";
  }

  render() {
    const highlightResult = JSON.parse(JSON.stringify(highlight(this.script))).map(value => html`<span class="${value[0]}">${value[1]}</span>`);
    const runResult = runScript(this.script);
    return html`<pre><code>${highlightResult}</code></pre><hr><pre><code>${runResult}</code></pre>`;
  }
}

function runScript(input: string) {
  let res = execute(input);
  if (typeof res === 'string' && res.startsWith("Error:")) {
    return html`<span class="error">${res}</span>`;
  } else {
    return html`<span class="result"><pre>${JSON.stringify(res)}</pre></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wander-code': WanderCode
  }
}
