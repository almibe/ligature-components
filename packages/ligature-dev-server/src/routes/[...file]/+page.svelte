<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    let { data } = $props();
    let script = data.script
    const uid = $props.id();
    let result = $state("")

    onMount(async () => {
        if (browser) {
            const module = await import('@ligature/ligature-components');
            const el = document.querySelector("#output-" + uid)
            result = module.printResult(module.runScript(script, el)) 
        }
    })
</script>

<div id="output-{uid}"></div>
<div id="result-{uid}">{result}</div>