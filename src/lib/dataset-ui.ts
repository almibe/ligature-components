import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js'

@customElement('dataset-ui')
export class Dataset extends LitElement {
    render() { return html`
        <h1>Datasets</h1>
        <button>Add Dataset</button>
        <table>
            <tr>
                <th>Dataset Name</th>
                <th>Remove?</th>
            </tr>
        </table>
    ` }
}
