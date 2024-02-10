import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { Result, ShellState, shellStoreContext } from './shell-state.ts';
import { MobxLitElement } from '@adobe/lit-mobx';

@customElement('shell-results')
export class ShellResults extends MobxLitElement {
  @consume({context: shellStoreContext})
  shellStore!: ShellState

  render() {
    return html`
          <div id="results">
          ${this.shellStore.results.map((result) =>
            html`<div class="result">${this.renderResult(result)}</div>`
          )}
        </div>
        `
  }

  static styles = css`
  `
  renderResult(result: Result) {
    const filteredApplets = () => this.shellStore.applets.filter((applet) => {
      return applet.predicate(result.wanderResult)
    })
    
    return html`<sl-card style="width:100%; padding:10px;">
        ${result.applet.render(result.wanderResult)}
        <sl-dropdown style="float:right">
            <sl-button slot="trigger">
               ${result.applet.name}<sl-icon name="caret" library="system"></sl-icon>
            </sl-button>
            <sl-menu id=${"menu" + result.id}>
                ${filteredApplets().map(applet => {
                    return html`<sl-menu-item @click=${() => result.applet = applet} >${applet.name}</sl-menu-item>`
                })}
                <sl-divider></sl-divider>
                <sl-menu-item @click=${() => this.shellStore.setScript(result.script)}>
                    <span>
                        Edit
                    </span>
                </sl-menu-item>
                <sl-menu-item @click=${() => this.shellStore.removeResult(result.id)}>
                    <span style="float:right">
                        Remove <sl-icon name="x-lg" library="system"></sl-icon>
                    </span>
                </sl-menu-item>
            </sl-menu>
        </sl-dropdown>
    </sl-card>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'shell-results': ShellResults
  }
}
