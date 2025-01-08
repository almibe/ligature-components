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
}

module Value = {
  type value =
    | VElement(Element.element)
    | VSlot(Slot.slot)
    | VLiteral(Literal.literal)
}

module Triple = {
  type triple = {
    element: ElementPattern.elementPattern,
    role: ElementPattern.elementPattern,
    value: Value.value,
  }

  let triple = (e, r, v) => {
    element: e,
    role: r,
    value: v,
  }
}

module Network = {
  type network = {"value": array<Triple.triple>, "type": string} //TODO make a set

  let network = value => {"value": value, "type": "network"}

  let emptyNetwork: network = network([])
}
