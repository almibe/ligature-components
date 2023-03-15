import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

@customElement('datasets-ui')
export class DatasetsUI extends LitElement {

    @property()
    datasets: string[] = [];

    render() { 
        const datasetList = [];
        this.datasets.forEach (
            dataset => datasetList.push(this.datasetRow(dataset))
        );

        return html`
            <sl-dialog label="Create Dataset" class="dialog-add-dataset">
                Add Dataset?
                <p><label>Name: <input name="datasetName" id="datasetName"></label></p>
                <p><button class="dialog-response-button button" @click="{() => addDataset()}">Add Dataset</button></p>
                <p><button class="dialog-response-button button" @click="{() => addDialog.hide()}">Cancel</button></p>
                <sl-button slot="footer" variant="primary">Close</sl-button>
            </sl-dialog>

            <h1>Datasets</h1>
            <sl-button @click="${this.addDataset}">Add Dataset</sl-button>
            <table>
                <thead>
                    <th>Dataset Name</th>
                    <th>Remove?</th>
                </thead>

            </table>`;
    }

    static styles = css`
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table thead, table tr {
            border-bottom: 1px solid #000;
        }
    `;

    private datasetRow(dataset: string) {
        return html`
            <tr>
                <td>${dataset}</td>
                <td></td>
            </tr>
        `;
    }

    private addDataset(e: Event) {
        const dialog = this.renderRoot.querySelector('.dialog-add-dataset')!!;
        const closeButton = this.renderRoot.querySelector('sl-button[slot="footer"]')!!;        
        closeButton.addEventListener('click', () => dialog.hide());
        dialog.show();
    }
}
