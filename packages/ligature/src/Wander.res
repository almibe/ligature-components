type stack = list<Ligature.wanderAtom>

type wanderResult = result<stack, string>

type action = (Ligature.networks, stack) => result<(Ligature.networks, stack), string>

type actions = Belt.Map.String.t<action>

let executeAction: (
  Ligature.Element.element,
  actions,
  Ligature.networks,
  stack,
) => result<(Ligature.networks, stack), string> = (action, actions, networks, stack) => {
  switch actions->Belt.Map.String.get(action.value) {
  | Some(action) => action(networks, stack)
  | None => Error("Could not find action " ++ action.value)
  }
}

let eval: (
  Ligature.wanderAtom,
  actions,
  Ligature.networks,
  stack,
) => result<(Ligature.networks, stack), string> = (atom, actions, networks, stack) => {
  switch atom {
  | Element(action) => executeAction(action, actions, networks, stack)
  | literal => Ok(networks, stack->List.add(literal))
  }
}

let run: (string, actions, Ligature.networks) => result<(Ligature.networks, stack), string> = (
  script,
  actions,
  networks,
) => {
  switch WanderParser.parse(script) {
  | Ok(values) => {
      let stack = ref(list{})
      let networks = ref(Ligature.emptyNetworks)
      values->Array.forEach(atom => {
        switch eval(atom, actions, networks.contents, stack.contents) {
        | Ok(newNetworks, newStack) => {
            stack := newStack
            networks := newNetworks
          }
        | Error(err) => raise(Failure("Error: " ++ err))
        }
      })
      Ok(networks.contents, stack.contents)
    }
  | Error(err) => Error(err)
  }
}

let readNetwork: string => result<Ligature.network, string> = input => {
  switch WanderParser.parse(input) {
  | Ok(results) =>
    if results->Array.length == 1 {
      switch results->Array.getUnsafe(0) {
      | Ligature.Network(network) => Ok(network)
      | _ => Error("Could not read network.")
      }
    } else {
      Error("Error reading Network.")
    }
  | Error(error) => Error(error)
  }
}

let printStack: stack => string = stack => {
  stack->List.reduce("", (state, value) => {state ++ " → " ++ Ligature.printValue(value) ++ "\n"})
}

let printResult: wanderResult => string = value => {
  switch value {
  | Ok(stack) => printStack(stack)
  | Error(error) => error
  }
}

let networkToJs = (network: Ligature.wanderAtom) => {
  switch network {
  | Network(network) => {
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
      result
    }
  | _ => raise(Failure("Unsupported."))
  }
}
