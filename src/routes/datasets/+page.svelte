<script>
    import Datasets from '../../lib/Datasets.svelte';

    let datasets = ["test 1", "test 2"];

    function addDataset(event) {
        datasets.push(event.detail);
        datasets = datasets;
    }

    function removeDataset(event) {
        datasets = datasets.filter((ds) => ds !== event.detail);
    }

    function openDataset(event) {
        console.log("Open Dataset - " + event.detail);
    }
</script>

<Datasets {datasets} 
    on:addDataset="{addDataset}" 
    on:removeDataset="{removeDataset}"
    on:openDataset="{openDataset}"></Datasets>
