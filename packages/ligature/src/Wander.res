type wanderResult = result<Ligature.network, string>

type stack = list<Ligature.wanderAtom>

type action = (Ligature.networks, stack) => unit

type actions = Belt.Map.String.t<action>

let run: (string, actions, Ligature.networks) => result<(Ligature.networks, stack), string> = (
  script,
  actions,
  networks
) => {
  let variables = ref(Belt.Map.String.empty)
  switch WanderParser.parse(script) {
  | Ok(values) => {
    let stack = list{}
    values->Array.forEach(expression => {
      ()
    })
    Ok(networks, stack)
  }
  | Error(err) => Error(err)
  }
}

let executeAction: (Ligature.Element.element, actions, Ligature.networks, stack) => result<(Ligature.networks, stack), string> = (
  action,
  actions,
  networks,
  stack
) => {
  raise(Failure("not complete"))
}

let eval: (Ligature.wanderAtom, actions, Ligature.networks, stack) => result<(Ligature.networks, stack), string> = (
  atom,
  actions,
  networks,
  stack
) => {
    switch atom {
    | Element(action) => {
      executeAction(action, actions, networks, stack)
    }
    | literal => {
      Ok(networks, stack->List.add(literal))
    }
    }
}

// let readNetwork: string => result<Ligature.network, string> = input => {
//   switch WanderParser.parse(input) {
//   | Ok(results) =>
//     if results->Array.length == 1 {
//       Ok(results->Array.getUnsafe(0))
//     } else {
//       Error("Error reading Network.")
//     }
//   | Error(error) => Error(error)
//   }
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
      network->Array.forEach(triple => {
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
