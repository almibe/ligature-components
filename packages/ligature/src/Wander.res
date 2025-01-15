type wanderResult = result<Ligature.network, string>

// let run = (
//   //: (string, Commands.modules) => result<option<Model.wanderAtom>, string> = (
//   script,
// ) => {
//   let variables = ref(Belt.Map.String.empty)
//   let script = WanderParser.parse(script)
//   let result = ref(Ok(None))
//   script->Array.forEach(expression => {
//     result :=
//       switch runExpression(expression.contents, variables.contents, modules) {
//       | Ok(Some(value)) => {
//           if expression.variableName != "" {
//             variables := variables.contents->Belt.Map.String.set(expression.variableName, value)
//           }
//           Ok(Some(value))
//         }
//       | Ok(None) => Ok(None)
//       | Error(err) => raise(Failure(err))
//       }
//   })
//   result.contents
// }

let printResult: wanderResult => string = value => {
  switch value {
  | Ok(value) => Ligature.printNetwork(value)
  | Error(error) => error
  }
}

type jsResult<'a> = [
  | #Error(string)
  | #Network('a)
]

let toJs: wanderResult => jsResult<'a> = (result: wanderResult) => {
  switch result {
  | Ok(network) => {
      let result = []
      network.value->Array.forEach(triple => {
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
