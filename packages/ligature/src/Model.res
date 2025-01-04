type rec call = {\"type": string, commandName: string, arguments: array<wanderValue>}

and script = array<call>

and wanderValue =
  | Element(Ligature.element)
  | Pipe
  | Comma
  | Variable(Ligature.variable)
  | Network(Ligature.network)
  | Literal(Ligature.literal)
  | Quote(quote)

and quote = array<wanderValue>

type command = unit => unit //--(local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, variables: Map<Variable, Element | Literal>, args: WanderValue[]) => WanderValue

let call: (string, array<wanderValue>) => call = (name, args) => {
  \"type": "call",
  commandName: name,
  arguments: args,
}
