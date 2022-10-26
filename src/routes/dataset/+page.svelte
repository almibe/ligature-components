<script>
    import Dataset from '../../lib/Dataset.svelte';

    let datasetName = "test-dataset";
    let resultText = "";

    function runQuery(event) {
        resultText = event.detail;
    }

    function runInsert(event) {
        resultText = "run insert - " + event.detail;
    }

    function runRemove(event) {
        resultText = "run remove - " + event.detail;
    }
</script>

<Dataset {datasetName}
    {resultText} 
    on:runQuery="{runQuery}" 
    on:runInsert="{runInsert}" 
    on:runRemove="{runRemove}"></Dataset>
