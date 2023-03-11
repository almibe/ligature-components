import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

@customElement('datasets-ui')
export class DatasetsUI extends LitElement {

    @property()
    datasets: string[] = []

    private datasetRow(dataset: string) {
        return html`
            <tr>
                <td>${dataset}</td>
                <td></td>
            </tr>
        `
    }

    render() { 
        const datasetList = [];
        this.datasets.forEach (
            dataset => datasetList.push(this.datasetRow(dataset))
        );

        return html`
            <sl-dialog label="Create Dataset" class="dialog-header-actions">
                <sl-icon-button class="new-window" slot="header-actions" name="box-arrow-up-right"></sl-icon-button>
                Add Dataset?
                <sl-button slot="footer" variant="primary">Close</sl-button>
            </sl-dialog>

            <h1>Datasets</h1>
            <sl-button>Add Dataset</sl-button>
            <table>
                <thead>
                    <th>Dataset Name</th>
                    <th>Remove?</th>
                </thead>

            </table>`
    }

    static styles = css`
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table thead, table tr {
            border-bottom: 1px solid #000;
        }
    `
}
