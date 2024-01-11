import { expect, test } from 'vitest';
import { Just, Nothing, Right } from 'purify-ts';
import { bindVariable, newEnvironment, newScope, read } from './environment.ts';

test('Environment should start empty', () => {
	const result = newEnvironment();
	expect(result).toMatchObject([new Map()]);
});

test('Reading from empty Environment should return Nothing', () => {
	const result = newEnvironment();
	expect(read(result, "hello")).toMatchObject(Nothing);
});

test('Write and read value', () => {
	let result = newEnvironment();
    result = bindVariable(result, "hello", {type: "Bool", value: true});
	expect(read(result, "hello")).toMatchObject(Just({type: "Bool", value: true}));
});

test('shadow in scope', () => {
    let env = newEnvironment();
    env = bindVariable(env, "hello", {type: "Bool", value: true});
    let env1 = newScope(env);
    let env2 = bindVariable(env1, "hello", {type: "Bool", value: false});
    expect(read(env1, "hello")).toMatchObject(Just({type: "Bool", value: true}));
    expect(read(env2, "hello")).toMatchObject(Just({type: "Bool", value: false}));
});
