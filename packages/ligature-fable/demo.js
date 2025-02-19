import { runWithActions, ok } from "./Library.fs.js";

let actions = new Map()

actions.set("echo", (stack) => {
    return ok(stack)
})

console.log(JSON.stringify(runWithActions(actions, "{} echo")))
