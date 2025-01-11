type wanderResult = result<option<Model.wanderAtom>, string>

let runExpression: (array<Model.wanderAtom>, Belt.Map.String.t<Model.wanderAtom>, Commands.modules) => wanderResult = (expression, variables, modules) => {
  switch List.fromArray(expression) {
  | list{value} => Ok(Some(value))
  | list{Model.Element({value: commandName}), ...args} => {
    let parts = commandName->String.split(".")
    switch parts {
    | [moduleName, commandName] =>
      switch modules->Belt.Map.String.get(moduleName) {
      | Some(mod) =>
        switch mod->Belt.Map.String.get(commandName) {
        | Some(command) => command(expression->Array.sliceToEnd(~start=1))
        | None => raise(Failure("Could not find command: " ++ commandName))
        }
      | None => raise(Failure("Could not find command: " ++ commandName))
      }
    | [commandName] => {
      raise(Failure("Local commands not supported yet."))
    }
    }
  }
  }
}

let run = (
  //: (string, Commands.modules) => result<option<Model.wanderAtom>, string> = (
  script,
  ~modules=Commands.stdModules(),
) => {
  let variables = ref(Belt.Map.String.empty)
  let script = WanderParser.parse(script)
  let result = ref(Ok(None))
  script->Array.forEach(expression => {
    result := switch runExpression(expression.contents, variables.contents, modules) {
      | Ok(Some(value)) => {
        if (expression.variableName != "") {
          variables := variables.contents->Belt.Map.String.set(expression.variableName, value)
        }
        Ok(Some(value))
      }
      | Ok(None) => Ok(None)
      | Error(err) => raise(Failure(err))
    }
  })
  result.contents
}

let printResult: wanderResult => string = value => {
  switch value {
  | Ok(None) => "--nothing--"
  | Ok(Some(value)) => Model.printValue(value)
  | Error(error) => error
  }
}

type jsResult<'a> = [
  | #Error(string)
  | #Network('a)
]

let toJs: wanderResult => jsResult<'a> = (result: wanderResult) => {
  switch result {
  | Ok(Some(Network(value))) => {
      let result = []
      value.value->Array.forEach(triple => {
        let element = switch triple.element {
        | Element(e) => {"type": "element", "value": e.value}
        | Slot(s) => {"type": "slot", "value": s.value}
        }

        let role = switch triple.role {
        | Element(e) => {"type": "element", "value": e.value}
        | Slot(s) => {"type": "slot", "value": s.value}
        }

        let value = switch triple.value {
        | VElement(e) => {"type": "element", "value": e.value}
        | VSlot(s) => {"type": "slot", "value": s.value}
        | VLiteral(l) => {"type": "literal", "value": l.value}
        }

        result->Array.push({"type": "triple", "element": element, "role": role, "value": value})
      })
      #Network(result)
    }
  | Error(error) => #Error(error)
  | _ => raise(Failure("Unexpected value, toJs only supports Networks."))
  }
}
