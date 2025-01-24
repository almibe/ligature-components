type sideEffect = Ligature.wanderAtom => unit

type stackSideEffect = list<Ligature.wanderAtom> => unit

let textAction: sideEffect => Wander.action = textCb => (networks, stack) => {
  textCb(List.head(stack)->Option.getUnsafe)
  Ok(networks, List.tail(stack)->Option.getUnsafe)
}

let tableAction: sideEffect => Wander.action = textCb => (networks, stack) => {
  textCb(List.head(stack)->Option.getUnsafe)
  Ok(networks, List.tail(stack)->Option.getUnsafe)
}

let graphAction: sideEffect => Wander.action = textCb => (networks, stack) => {
  textCb(List.head(stack)->Option.getUnsafe)
  Ok(networks, List.tail(stack)->Option.getUnsafe)
}

let displayStackAction: stackSideEffect => Wander.action = textCb => (networks, stack) => {
  textCb(stack)
  Ok(networks, stack)
}

let componentActions: (
  stackSideEffect,
  sideEffect,
  sideEffect,
  sideEffect,
) => Belt.Map.String.t<Wander.action> = (stackCb, textCb, tableCb, graphCb) => {
  Belt.Map.String.fromArray(
    [
      ("display-stack", displayStackAction(stackCb)),
      ("display-text", textAction(textCb)),
      ("display-table", tableAction(tableCb)),
      ("display-graph", graphAction(graphCb)),
      ...Belt.Map.String.toArray(Actions.stdActions),
    ],
  )
}
