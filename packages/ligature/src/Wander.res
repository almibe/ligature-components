let run = (
  //: (string, Commands.modules) => result<option<Model.wanderValue>, string> = (
  script,
  ~modules=Commands.stdModules(),
) => {
  let script = WanderParser.parse(script)
  let result = ref(Ok(None))
  Console.log(modules)
  Console.log(Commands.stdModules())
  script->Array.forEach(call => {
    let parts = call.commandName->String.split(".")
    switch parts {
    | [moduleName, commandName] =>
      switch modules->Belt.Map.String.get(moduleName) {
      | Some(mod) =>
        switch mod->Belt.Map.String.get(commandName) {
        | Some(command) => result := command(call.arguments)
        | None => ()
        }
      | None => raise(Failure("Could not find command: " ++ call.commandName))
      }
    | _ => ()
    }
  })
  result.contents
}
