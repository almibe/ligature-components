export type WanderError = string;

export interface IntegerValue {
    readonly value: bigint
    readonly type: "Int"
}

export interface StringValue {
    readonly value: string
    readonly type: "String"
}

export interface BoolValue {
    readonly value: boolean
    readonly type: "Bool"
}

export type WanderValue = IntegerValue | StringValue | BoolValue;

export type WanderResult = WanderError | WanderValue;
