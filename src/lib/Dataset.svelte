<script lang="ts">
import "bulma/css/bulma.css";
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";
import "tabbyjs/dist/css/tabby-ui.css";
import { onMount, createEventDispatcher } from 'svelte';
import { wanderResultToPresentation } from './presentation';
import cytoscape from 'cytoscape';

import {EditorView, basicSetup} from "codemirror";
import {EditorState} from "@codemirror/state";
import {javascript} from "@codemirror/lang-javascript";

export let datasetName = "";
export let resultText = "";
let selectedResultTab = 'table';
let dispatch = createEventDispatcher();

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
    // const CodeMirror = (await import('codemirror')).default;
    tabs = new Tabby('[data-tabs]');
    // inputEditor = CodeMirror.fromTextArea(document.getElementById("editorTextArea"), {lineNumbers: true});
    document.addEventListener('tabby', onTabChange, false);

    table = new Tabulator("#table", {
 	    height:205,
 	    data:[],
 	    layout:"fitColumns",
 	    columns:[{title:"", field:""}]});

    initGraph();

    inputEditor = new EditorView({
        extensions: [basicSetup, javascript()],
        parent: document.getElementById("textEditor")
    });

    //clean up
    return () => {
        document.removeEventListener('tabby', onTabChange);
    };
});

function onTabChange(event) {
    var tab = event.target.href.split("#")[1];
    text[currentTab] = inputEditor.state.doc.toString();
    text[currentTab + "Results"] = resultText;
    inputEditor.dispatch({
        changes: {from: 0, to: inputEditor.state.doc.length, insert: text[tab]}
    })
    resultText = text[tab + "Results"];
    if (tab === 'query') {
        document.getElementById("queryResultTabs").style.display = "block";
        resultDisplay(selectedResultTab);
    } else {
        document.getElementById("queryResultTabs").style.display = "none";
        document.getElementById("table").style.display = "none";
        document.getElementById("graph").style.display = "none";
        document.getElementById("resultText").style.display = "block";
    }
    currentTab = tab;
}

$: {
    if (currentTab == 'query') {
        if (table != undefined && table != null && table.initialized) {
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
        }
    }
    text[currentTab + "Results"] = resultText;
}

async function runQuery() {
    dispatch('runQuery', inputEditor.state.doc.toString());
}

async function runInsert() {
    dispatch("runInsert", inputEditor.state.doc.toString());
}

async function runRemove() {
    dispatch("runRemove", inputEditor.state.doc.toString());
}

function clear() {
    inputEditor.setState(EditorState.create({doc: "", extensions: [basicSetup, javascript()]}))
    text[currentTab] = "";
    text[currentTab + "Results"] = "";
    resultText = "";
    //TODO if current tab is query clear table and graph as well
}

function resultDisplay(selectedTab: string) {
    selectedResultTab = selectedTab;
    document.getElementById("result-table-tab")?.classList.remove("is-active");
    document.getElementById("result-graph-tab")?.classList.remove("is-active");
    document.getElementById("result-text-tab")?.classList.remove("is-active");

    document.getElementById(`result-${selectedResultTab}-tab`)?.classList.add("is-active");
    
    if (selectedResultTab == 'table') {
        document.getElementById("table").style.display = "block";
        document.getElementById("graph").style.display = "none";
        document.getElementById("resultText").style.display = "none";
    } else if (selectedResultTab == 'graph') {
        document.getElementById("graph").style.display = "block";
        document.getElementById("table").style.display = "none";
        document.getElementById("resultText").style.display = "none";
    } else {
        document.getElementById("resultText").style.display = "block";
        document.getElementById("table").style.display = "none";
        document.getElementById("graph").style.display = "none";
    }
}
</script>

<h1 class="title">{datasetName}</h1>
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

<div id="textEditor"></div>

<div id="results">
    <div id="queryResultTabs" class="tabs">
        <ul>
          <li id="result-table-tab" class="is-active"><a href="#results" on:click={() => resultDisplay("table")}>Table</a></li>
          <li id="result-graph-tab"><a href="#results" on:click={() => resultDisplay("graph")}>Graph</a></li>
          <li id="result-text-tab"><a href="#results" on:click={() => resultDisplay("text")}>Text</a></li>
        </ul>
    </div>
    <div id="table"></div>
    <div id="graph"><div id="cy"></div></div>
    <div id="resultText"><pre>{resultText}</pre></div>
</div>

<style>
    #graph {
        display: none;
    }
    #resultText {
        display: none;
    }
    #textEditor {
        height:500px;
        overflow:scroll;
    }
    #cy {
        width: 1000px;
        height: 500px;
        display: block;
    }

    .backButton {
        float: right;
    }
</style>
