type element = {"value": string, "type": string}

type variable = {"value": string, "type": string}

type literal = {"value": string, "type": string}

let element = value => {"value": value, "type": "element"}

let variable = value => {"value": value, "type": "variable"}

let literal = value => {"value": value, "type": "literal"}

type elementPattern =
  | Element(element)
  | Variable(variable)

type value =
  | VElement(element)
  | VVariable(variable)
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
