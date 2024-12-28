import { Record, Set } from "immutable";

const Element = Record({type: "element", value: "_"})
type Element = Record<{ type:string, value: string }>
export const element = (value: string): Element => Element({value: value})

const Variable = Record({type: "variable", value: "?_"})
type Variable = Record<{ type:string, value: string }>
export const variable = (value: string) => Variable({value: value})

const Literal = Record({type: "literal", value: ""})
type Literal = Record<{ type:string, value: string }>
export const literal = (value: string) => Literal({value: value})

const Triple = Record({type: "triple", element: Element(), role: Element(), value: Element()})
type Triple = Record<{ type:string, element: Element | Variable, role: Element | Variable, value: Element | Variable | Literal }>
export const triple = (element: Element | Variable, role: Element | Variable, value: Element | Variable | Literal) =>
        Triple({element: element, role: role, value: value})

export type Network = Set<Triple>
