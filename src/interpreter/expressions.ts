import { Immutable } from "immer";

export type IntegerExpr = Immutable<{
    value: bigint,
    type: "Int"
}>

export type StringExpr = Immutable<{
    value: string,
    type: "String"
}>

export type BoolExpr = Immutable<{
    value: boolean,
    type: "Bool"
}>

export type Expression = IntegerExpr | StringExpr | BoolExpr;
