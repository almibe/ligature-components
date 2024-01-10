import { Immutable } from "immer";

export type IntegerValue = Immutable<{
    value: bigint,
    type: "Int"
}>

export type StringValue = Immutable<{
    value: string,
    type: "String"
}>

export type BoolValue = Immutable<{
    value: boolean,
    type: "Bool"
}>

export type WanderValue = IntegerValue | StringValue | BoolValue;
