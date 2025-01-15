module Element = {
  type element = {value: string, \"type": string}
  let element = value => {value, \"type": "element"}
}

module Slot = {
  type slot = {value: string, \"type": string}
  let slot = value => {value, \"type": "slot"}
}

module Literal = {
  type literal = {value: string, \"type": string}
  let literal = value => {value, \"type": "literal"}
}

module ElementPattern = {
  type elementPattern =
    | Element(Element.element)
    | Slot(Slot.slot)

  let printElementPattern: elementPattern => string = value => {
    switch value {
    | Element(el) => el.value
    | Slot(slot) => slot.value
    }
  }
}

type rec triple = {
  element: ElementPattern.elementPattern,
  role: ElementPattern.elementPattern,
  value: value,
}

and network = {value: array<triple>, \"type": string} //TODO make a set

and value =
  | VElement(Element.element)
  | VSlot(Slot.slot)
  | VLiteral(Literal.literal)
  | VQuote(quote)
  | VNetwork

and script = array<network>

and variable = {value: string, \"type": string}

and wanderAtom =
  | Element(Element.element)
  | Comma
  | Slot(Slot.slot)
  | Variable(variable)
  | Network(network)
  | Literal(Literal.literal)
  | Quote(quote)

and quote = array<wanderAtom>

let variable = value => {value, \"type": "variable"}

let printValue: value => string = v => {
  switch v {
  | VElement(el) => el.value
  | VSlot(slot) => slot.value
  | VLiteral(literal) => literal.value
  }
}

let triple = (e, r, v) => {
  element: e,
  role: r,
  value: v,
}

let printTriple: triple => string = value => {
  ElementPattern.printElementPattern(value.element) ++
  " " ++
  ElementPattern.printElementPattern(value.role) ++
  " " ++
  printValue(value.value)
}

let network = value => {value, \"type": "network"}

let emptyNetwork: network = network([])

let printValue: wanderAtom => string = value => {
  switch value {
  | Element(ele) => ele.value
  | Slot(slot) => slot.value
  | Network(network) => {
      let result = ref("{\n")
      network.value->Array.forEach(triple => {
        result := result.contents ++ "  " ++ printTriple(triple) ++ ",\n"
      })
      result := result.contents ++ "}"
      result.contents
    }
  | Literal(literal) => literal.value
  | _ => raise(Failure("TODO"))
  }
}

let printNetwork: network => string = network => {
  let result = ref("{\n")
  network.value->Array.forEach(triple => {
    result := result.contents ++ "  " ++ printTriple(triple) ++ ",\n"
  })
  result := result.contents ++ "}"
  result.contents
}
