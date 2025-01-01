import { Record, Set } from "immutable";

const Element = Record({type: "element", value: "_"})
export type Element = Record<{ type:string, value: string }>
export const element = (value: string): Element => Element({value: value})

const Variable = Record({type: "variable", value: "?_"})
export type Variable = Record<{ type:string, value: string }>
export const variable = (value: string) => Variable({value: value})

const Literal = Record({type: "literal", value: ""})
export type Literal = Record<{ type:string, value: string }>
export const literal = (value: string) => Literal({value: value})

const Triple = Record({type: "triple", element: Element(), role: Element(), value: Element()})
export type Triple = Record<{ type:string, element: Element | Variable, role: Element | Variable, value: Element | Variable | Literal }>
export const triple = (element: Element | Variable, role: Element | Variable, value: Element | Variable | Literal) =>
        Triple({element: element, role: role, value: value})

const Network = Record({type: "network", value: Set<Triple>()})
export type Network = Record<{ type:string, value: Set<Triple> }>
export const network = (value: Set<Triple>) => Network({value: value})
