import { Record, Set } from 'immutable'
import { match, P } from 'ts-pattern'

export class Element extends Record({
  type: "element",
  value: "",
}) {}
export function element(value: string) {
  return new Element({value: value})
}

export class NetworkName extends Record({
  type: "networkName", 
  value: ""
}) {}
export function networkName(value: string) {
  return new NetworkName({value: value})
}

export class Slot extends Record({type: "slot", value: ""}) {}
export function slot(value: string) {
  return new Slot({value: value})
}

export class Literal extends Record({type: "literal", value: ""}) {}
export function literal(value: string) {
  return new Literal({value: value})
}

export type ElementPattern = Element | Slot

export class Triple extends Record({type: "triple", element: element(""), role: element(""), value: element("")}) {}
export function triple(element: ElementPattern, role: ElementPattern, value: ElementPattern) {
  return new Triple({element: element, role: role, value: value})
}

export type Network = Set<Triple>

export type Networks = Map<NetworkName, Network>

export type Value = Element | Slot | Literal | Quote | NetworkName

export type Script = Array<WanderAtom>

export type WanderAtom = 
  Element 
  | Slot
  | Network
  | Literal
  | Quote
  | NetworkName

export type Quote = Array<WanderAtom>

// let printTriple: triple<'v> => string = value => {
//   ElementPattern.printElementPattern(value.element) ++
//   " " ++
//   ElementPattern.printElementPattern(value.role) ++
//   " " ++
//   printValue(value.value)
// }

// let printValue: wanderAtom<'v> => string = value => {
//   switch value {
//   | Element(ele) => ele.value
//   | Slot(slot) => slot.value
//   | Network(network) => {
//       let result = ref("{\n")
//       network->Array.forEach(triple => {
//         result := result.contents ++ "  " ++ printTriple(triple) ++ ",\n"
//       })
//       result := result.contents ++ "}"
//       result.contents
//     }
//   | Literal(literal) => literal.value
//   | _ => raise(Failure("TODO"))
//   }
// }

// let printNetwork: network<'v> => string = network => {
//   let result = ref("{\n")
//   network->Array.forEach(triple => {
//     result := result.contents ++ "  " ++ printTriple(triple) ++ ",\n"
//   })
//   result := result.contents ++ "}"
//   result.contents
// }

// let emptyNetworks = Belt.Map.String.empty
