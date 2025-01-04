
let run: (string) => option<Model.wanderValue> = (script) => {
    // let 
    // Model.Element (Ligature.element("result"))
    raise(Failure("TODO"))
}

// -- export function run(
// --       script: string, 
// --       local: Map<Element, Command> = defaultLocals, 
// --       modules: Map<Element, Map<Element, Command>> = stdModules) {
// --   let ast = parse(script)
// --   let result = {}
// --   for (let statement of ast) {
// --     if (statement.type == "call") {
// --       const name = statement.commandName
// --       let res = local.find((command, ele) => ele.value == name)
// --       if (res != undefined) {
// --         result = res(local, modules, Map(), statement.arguments)
// --       } else {
// --         throw "Command not found."
// --       }
// --     } else {
// --       throw "unexpected type " + JSON.stringify(statement)
// --     }
// --   }
// --   return result
// -- }
