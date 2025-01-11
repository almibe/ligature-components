module Variable = {
  type variable = {value: string, \"type": string}
  let variable = value => {value, \"type": "variable"}
}

type rec expression = {\"type": string, variableName: string, contents: array<wanderAtom>}

and script = array<expression>

and wanderAtom =
  | Element(Ligature.Element.element)
  | Pipe
  | Comma
  | EqualSign
  | Slot(Ligature.Slot.slot)
  | Variable(Variable.variable)
  | Network(Ligature.Network.network)
  | Literal(Ligature.Literal.literal)
  | Quote(quote)

and quote = array<wanderAtom>

type arguments = array<wanderAtom>

type command = arguments => result<option<wanderAtom>, string> //--(local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, slots: Map<Slot, Element | Literal>, args: WanderValue[]) => WanderValue

let expression: (string, array<wanderAtom>) => expression = (name, contents) => {
  \"type": "expression",
  variableName: name,
  contents: contents,
}

let printValue: wanderAtom => string = value => {
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
  | _ => raise(Failure("TODO"))
  }
}
