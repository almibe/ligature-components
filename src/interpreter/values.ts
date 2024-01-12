import { Immutable } from 'immer';
import { Either } from 'purify-ts/Either'
import { Environment } from './environment';
import { Expression } from './expressions';

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

export interface ArrayValue {
    readonly value: WanderValue[]
    readonly type: "Array"
}

export interface ModuleValue {
    readonly value: Immutable<Map<string, WanderValue>>
    readonly type: "Module"
}

export interface LambdaValue {
    readonly parameters: string[]
    readonly body: Expression
    readonly type: "Lambda"
}

export type WanderValue = ModuleValue | ArrayValue | IntegerValue | StringValue | BoolValue | LambdaValue;

export type WanderResult = Either<WanderError, [WanderValue, Environment]>;
