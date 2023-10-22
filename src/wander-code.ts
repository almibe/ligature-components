import { run, introspect } from '@wander-lang/wander';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wander-code')
export class WanderCode extends LitElement {
  createRenderRoot() {
    return this;
  }
  
  @property()
  script: string = "";

  connectedCallback(): void {
    super.connectedCallback();
    this.script = this.textContent!!;
    this.textContent = "";
  }

  render() {
    const highlightResult = highlight(this.script);
    const runResult = runScript(this.script);
    return html`<pre><code>${highlightResult}</code></pre><hr><pre><code>${runResult}</code></pre>`;
  }
}

function runScript(input: string) {
  let res = run(input);
  if (res.string.Ok) {
    return html`<span class="result">Result:${res.string.Ok}`;
  } else {
    return html`<span class="error">Error: ${res.string.Err}</span>`;
  }
}

function highlight(input: string) {
  let intro = introspect(input);
  if (intro.Ok) {
    let tokens = intro.Ok.tokens_ws;
    return html`${tokens.map((token) => highlight_token(token))}`;
  } else {
    return html`<span class="error">Error: ${intro.Err}</span>`;
  }
}

const keywords = ["Let", "In", "End", "Val", "If", "Else", "When"];

const syntax = {
  OpenParen: "(",
  CloseParen: ")",
  SingleQuote: "'",
  EqualSign: "=",
  OpenSquare: "[",
  CloseSquare: "]",
  OpenBrace: "{",
  CloseBrace: "}",
  Lambda: "\\",
  Arrow: "->",
  Colon: ":",
}

function highlight_token(token) {
  if (token.WS) {
    return html`${token.WS}`
  } else if (keywords.includes(token)) {
    return html`<span class="keyword">${token.toLowerCase()}</span>`
  } else if (token in syntax) {
    return html`<span class="syntax">${syntax[token]}</span>`
  } else if (token.Name) {
    return html`<span class="name">${token.Name}<span>`
  } else if (token.String) {
    return html`<span class="string">"${token.String}"<span>`
  } else {
    throw new DOMException(`Unhandled ${JSON.stringify(token)}`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wander-code': WanderCode
  }
}
