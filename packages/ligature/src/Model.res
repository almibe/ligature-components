type rec call = {\"type": string, commandName: string, arguments: array<wanderValue>}

and script = array<call>

and wanderValue =
  | Element(Ligature.element)
  | Pipe
  | Comma
  | Slot(Ligature.slot)
  | Network(Ligature.network)
  | Literal(Ligature.literal)
  | Quote(quote)

and quote = array<wanderValue>

type arguments = array<wanderValue>

type command = arguments => result<option<wanderValue>, string> //--(local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, slots: Map<Slot, Element | Literal>, args: WanderValue[]) => WanderValue

let call: (string, array<wanderValue>) => call = (name, args) => {
  \"type": "call",
  commandName: name,
  arguments: args,
}
