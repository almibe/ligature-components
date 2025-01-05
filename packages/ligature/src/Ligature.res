type element = {"value": string, "type": string}

type slot = {"value": string, "type": string}

type literal = {"value": string, "type": string}

let element = value => {"value": value, "type": "element"}

let slot = value => {"value": value, "type": "slot"}

let literal = value => {"value": value, "type": "literal"}

type elementPattern =
  | Element(element)
  | Slot(slot)

type value =
  | VElement(element)
  | VSlot(slot)
  | VLiteral(literal)

type triple = {
  element: elementPattern,
  role: elementPattern,
  value: value,
}

let triple = (e, r, v) => {
  element: e,
  role: r,
  value: v,
}

type network = {"value": array<triple>, "type": string} //TODO make a set

let network = value => {"value": value, "type": "network"}

let emptyNetwork: network = network([])
