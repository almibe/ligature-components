import { std } from "../../../wander/src/modules/library";
import { printResult, run } from "../../../wander/src/interpreter";
import { parse } from "../../../wander/src/parser";
import "./style.css";
import { initializeRepl } from "wander-components/src/repl/repl.ts"
import Navigo from 'navigo';

const router = new Navigo('/');

router.on('/term', function () {
    initializeRepl("app", async (script) => {
        if (script.startsWith("!")) {
            const finalScript = `{action="inspect", script=${JSON.stringify(script.slice(1))}}`
            console.log("Running", finalScript);
            let result = await fetch("/wander", {
                method: "POST",
                body: finalScript
            });
            let resultText = await result.text();
            return resultText;
        } else {
            const finalScript = `{action="run", script=${JSON.stringify(script)}}`
            console.log("Running", finalScript);
            let result = await fetch("/wander", {
                method: "POST",
                body: finalScript
            });
            let resultText = await result.text();
            return resultText;
        }
        
        // printResult(run(script));
    
        // if (script.startsWith("!")) {
        //     script = script.slice(1);
        //     return JSON.stringify(parse(script), null, 2);
        // } else {
        //     const result = printResult(run(script, std()));
        //     return result;
        // }
    });
        // do something
});

router.resolve();
