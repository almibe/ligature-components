import { Immutable } from "immer"

export interface GroupingExpr {
    readonly expressions: Expression[]
    readonly type: "Grouping"
}

export interface ModuleExpr {
    readonly value: Immutable<Map<string, Expression>>
    readonly type: "Module"
}

export interface ArrayExpr {
    readonly value: Expression[]
    readonly type: "Array"
}

export interface IntegerExpr {
    readonly value: bigint
    readonly type: "Int"
}

export interface StringExpr {
    readonly value: string
    readonly type: "String"
}

export interface BoolExpr {
    readonly value: boolean
    readonly type: "Bool"
}

export type Expression = ModuleExpr | ArrayExpr | GroupingExpr | IntegerExpr | StringExpr | BoolExpr;
