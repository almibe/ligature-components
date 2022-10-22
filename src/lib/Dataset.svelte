<script lang="ts">
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import  "tabulator-tables/dist/css/tabulator.min.css";
import "blueprint-css/dist/blueprint.css";
import "tabbyjs/dist/css/tabby-ui.css";
import "codemirror/lib/codemirror.css";
import { page } from '$app/stores';
import { onMount, onDestroy } from 'svelte';
import { wanderResultToPresentation } from '../../lib/presentation';
import cytoscape from 'cytoscape';

let inputEditor = null;
let text = {
    query : "",
    insert : "",
    remove : "",
    queryResults: "",
    insertResults: "",
    removeResults: ""
};
let tabs = null;
let table = null;
let cy = null;
let currentTab = "query";
let resultText = "";

function initGraph() {
    cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [],
      style: [{
        selector: 'node',
        style: {
            'width': 10,
            'height': 10,
            'background-color': '#666',
            'label': 'data(id)'
        }},
        {
        selector: 'edge',
        style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)'
        }
        }
    ],

    layout: {
        name: 'cose',
    }
    });
}

function updateGraph(elements) {
    cy.filter().forEach(element => {
        element.remove();
    });
    cy.add(elements);
    cy.layout({name: 'cose'}).run();
}

onMount(async () => {
    const Tabby = (await import('tabbyjs')).default;
    const CodeMirror = (await import('codemirror')).default;
    tabs = new Tabby('[data-tabs]');
    inputEditor = CodeMirror.fromTextArea(document.getElementById("editorTextArea"), {lineNumbers: true});
    document.addEventListener('tabby', onTabChange, false);

    table = new Tabulator("#table", {
 	    height:205,
 	    data:[],
 	    layout:"fitColumns",
 	    columns:[{title:"", field:""}]});

    initGraph();

    //clean up
    return () => {
        document.removeEventListener('tabby', onTabChange);
    };
});

function onTabChange(event) {
    var tab = event.target.href.split("#")[1];
    text[currentTab] = inputEditor.getValue();
    text[currentTab + "Results"] = resultText;
    inputEditor.setValue(text[tab]);
    resultText = text[tab + "Results"];
    currentTab = tab;
}

async function runQuery() {
    let result = await fetch(`/datasets/${$page.params.datasetName}/wander`, {
        method: 'POST',
        body: inputEditor.getValue()
    });
    resultText = await result.text();

    let presentation = wanderResultToPresentation(resultText);
    if ('error' in presentation) {
        //TODO handle error
    } else {
        //handle table
        let tablePresentation = presentation.tableView();
        table.setColumns(tablePresentation.columns);
        table.replaceData(tablePresentation.data);
        //handle graph
        updateGraph(presentation.graphElements());
    }
    text["queryResults"] = resultText;
}

async function runInsert() {
    let result = await fetch(`/datasets/${$page.params.datasetName}/statements`, {
        method: 'POST',
        body: inputEditor.getValue()
    })
    resultText = await result.text();
    text["insertResults"] = resultText;
}

async function runRemove() {
    let result = await fetch(`/datasets/${$page.params.datasetName}/statements`, {
        method: 'DELETE',
        body: inputEditor.getValue()
    })
    resultText = await result.text();
    text["removeResults"] = resultText;
}

function clear() {
    inputEditor.setValue("");
    inputEditor.clearHistory();
    text[currentTab] = "";
    text[currentTab + "Results"] = "";
}

function resultDisplay(selectedResultTab: string) {
    document.getElementById("result-table-tab")?.classList.remove("is-active");
    document.getElementById("result-graph-tab")?.classList.remove("is-active");
    document.getElementById("result-text-tab")?.classList.remove("is-active");

    document.getElementById(`result-${selectedResultTab}-tab`)?.classList.add("is-active");

    document.getElementById("table").style.display = "none";
    document.getElementById("graph").style.display = "none";
    document.getElementById("resultText").style.display = "none";
    
    if (selectedResultTab == 'table') {
        document.getElementById("table").style.display = "block";
    } else if (selectedResultTab == 'graph') {
        document.getElementById("graph").style.display = "block";
    } else {
        document.getElementById("resultText").style.display = "block";
    }
}
</script>

<h1 class="title">{$page.params.datasetName}</h1>
<button class="button backButton" on:click={() => window.location.href = '/'}>Back</button>

<ul data-tabs>
    <li><a data-tabby-default href="#query">Query</a></li>
    <li><a href="#insert">Insert</a></li>
    <li><a href="#remove">Remove</a></li>
</ul>

<div id="query">
    <button class="button" on:click={() => runQuery()}>Run</button>
    <button class="button" on:click={() => clear()}>Clear</button>
</div>

<div id="insert">
    <button class="button" on:click={() => runInsert()}>Run</button>
    <button class="button" on:click={() => clear()}>Clear</button>
</div>

<div id="remove">
    <button class="button" on:click={() => runRemove()}>Run</button>
    <button class="button" on:click={() => clear()}>Clear</button>
</div>

<div id="textEditor">
    <textarea id="editorTextArea"></textarea>
</div>

<div id="results">
    <div class="tabs">
        <ul>
          <li id="result-table-tab" class="is-active"><a on:click={() => resultDisplay("table")}>Table</a></li>
          <li id="result-graph-tab"><a on:click={() => resultDisplay("graph")}>Graph</a></li>
          <li id="result-text-tab"><a on:click={() => resultDisplay("text")}>Text</a></li>
        </ul>
    </div>
    <div id="table"></div>
    <div id="graph"><div id="cy"></div></div>
    <div id="resultText"><pre>{resultText}</pre></div>
</div>

<style>
    #cy {
        width: 1000px;
        height: 500px;
        display: block;
    }

    .backButton {
        float: right;
    }
</style>
