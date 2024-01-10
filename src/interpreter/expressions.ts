export interface GroupingExpr {
    expressions: Expression[]
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

export type Expression = GroupingExpr | IntegerExpr | StringExpr | BoolExpr;
