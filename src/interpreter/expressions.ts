import { Immutable } from "immer"

export interface BindingExpr {
    readonly name: string
    readonly value: any //TODO should be Expression
    readonly type: "Binding"
}

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

export interface NameExpr {
    readonly value: string,
    readonly type: "Name"
}

export interface LambdaExpr {
    readonly parameters: string[]
    readonly body: Expression
    readonly type: "Lambda"
}

export type Expression = BindingExpr | ModuleExpr | ArrayExpr | GroupingExpr 
    | IntegerExpr | StringExpr | BoolExpr | NameExpr | LambdaExpr;
