type rec call = {\"type": string, commandName: string, arguments: array<wanderValue>}

and script = array<call>

and wanderValue =
  | Element(Ligature.Element.element)
  | Pipe
  | Comma
  | Slot(Ligature.Slot.slot)
  | Network(Ligature.Network.network)
  | Literal(Ligature.Literal.literal)
  | Quote(quote)

and quote = array<wanderValue>

type arguments = array<wanderValue>

type command = arguments => result<option<wanderValue>, string> //--(local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, slots: Map<Slot, Element | Literal>, args: WanderValue[]) => WanderValue

let call: (string, array<wanderValue>) => call = (name, args) => {
  \"type": "call",
  commandName: name,
  arguments: args,
}

let printValue: wanderValue => string = value => {
  switch value {
  | Element(ele) => ele.value
  | Slot(slot) => slot.value
  | Network(network) => {
    let result = ref("{\n")
    network.value->Array.forEach(triple => {
      result := result.contents ++ "  " ++ Ligature.Triple.printTriple(triple) ++ ",\n"
    })
    result := result.contents ++ "}"
    result.contents
  }
  | Literal(literal) => literal.value
  | _ => %todo
  }
}
