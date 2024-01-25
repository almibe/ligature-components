import { Immutable } from "immer"
import { Field, FieldPath, TaggedField } from "./values"

export interface BindingExpr {
    readonly field: Field
    readonly value: any //TODO should be Expression
    readonly type: "Binding"
}

export interface GroupingExpr {
    readonly expressions: Expression[]
    readonly type: "Grouping"
}

export interface ModuleExpr {
    readonly value: Immutable<Map<Field, Expression>>
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

export interface FieldPathExpr {
    readonly value: FieldPath,
    readonly type: "FieldPath"
}

export interface LambdaExpr {
    readonly parameters: TaggedField[]
    readonly body: Expression
    readonly type: "Lambda"
}

export interface ApplicationExpr {
    readonly fieldPath: FieldPath
    readonly args: Expression[]
    readonly type: "Application"
}

export interface WhenExpr {
    readonly body: Immutable<{condition: Expression, body: Expression}[]>
    readonly type: "When"
}

export type Expression = BindingExpr | ModuleExpr | ArrayExpr | GroupingExpr | WhenExpr
    | IntegerExpr | StringExpr | BoolExpr | FieldPathExpr | LambdaExpr | ApplicationExpr;
