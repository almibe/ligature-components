<script>
    import Dataset from '../../lib/Dataset.svelte';

    let resultText = "";

    function runQuery(event) {
        resultText = "run query - " + event.detail;
    }

    function runInsert(event) {
        resultText = "run insert - " + event.detail;
    }

    function runRemove(event) {
        resultText = "run remove - " + event.detail;
    }
</script>

<Dataset {resultText} 
    on:runQuery="{runQuery}" 
    on:runInsert="{runInsert}" 
    on:runRemove="{runRemove}"></Dataset>
