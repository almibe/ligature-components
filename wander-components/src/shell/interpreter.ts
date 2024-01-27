import { bus } from './bus.ts';
import { std } from '@wander-lang/wander/src/host/library.ts';
import { run } from '@wander-lang/wander/src/interpreter.ts';
import { ModuleValue } from '@wander-lang/wander/src/values.ts';

bus.on("RunScript", ({ script }) => {
        const m: ModuleValue = {type: "Module", value: new Map([["action", {type: "String", value: "run" }], ["script", {type: "String", value: script}]])}
        bus.emit("AddResult", {
                script, result: run(script, std())
        });
})
