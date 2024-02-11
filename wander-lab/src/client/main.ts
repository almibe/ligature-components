import { printResult, run } from "../../../wander/src/interpreter";
import { parse } from "../../../wander/src/parser";
import "./style.css";
import { initializeRepl } from "wander-components/src/repl/repl.ts"

initializeRepl("app", async (script) => {
    // let result = await fetch("/wander", {
    //     method: "POST",
    //     body: script
    // });
    // let resultText = await result.text();
    // return resultText;
    // printResult(run(script));
    if (script.startsWith("!")) {
        script = script.slice(1);
        return JSON.stringify(parse(script), null, 2);
    } else {
        const result = printResult(run(script));
        return result;
    }
});
