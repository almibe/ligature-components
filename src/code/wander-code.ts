import { run, inspect } from '@wander-lang/wander';

export function wanderCode(className: string) {
  const element = document.getElementById(id);
  const highlightResult = JSON.parse(JSON.stringify(highlight(script))).map(value => `<span class="${value[0]}">${value[1]}</span>`);
  const runResult = runScript(script);
  element.innerHTML = `<pre><code>${highlightResult}</code></pre><hr><pre><code>${runResult}</code></pre>`;
}

function runScript(input: string) {
  let res = execute(input);
  if (typeof res === 'string' && res.startsWith("Error:")) {
    return `<span class="error">${res}</span>`;
  } else {
    return `<span class="result"><pre>${JSON.stringify(res)}</pre></span>`;
  }
}
