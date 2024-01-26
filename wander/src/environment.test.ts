import { expect, test } from 'vitest';
import { Just, Nothing, Right } from 'purify-ts';
import { bindVariable, newEnvironment, newScope, read } from './environment.ts';

test('Environment should start empty', () => {
	const result = newEnvironment([]);
	expect(result).toMatchObject({ scope: [new Map()], libraries: [] });
});

test('Reading from empty Environment should return Nothing', () => {
	const result = newEnvironment([]);
	expect(read(result, {parts:[{name: "hello"}]})).toMatchObject(Nothing);
});

test('Write and read value', () => {
	let result = newEnvironment([]);
    result = bindVariable(result, {name: "hello"}, {type: "Bool", value: true});
	expect(read(result, {parts:[{name:"hello"}]})).toMatchObject(Just({type: "Bool", value: true}));
});

test('shadow in scope', () => {
    let env = newEnvironment([]);
    env = bindVariable(env, {name: "hello"}, {type: "Bool", value: true});
    let env1 = newScope(env);
    let env2 = bindVariable(env1, {name: "hello"}, {type: "Bool", value: false});
    expect(read(env1, {parts:[{name:"hello"}]})).toMatchObject(Just({type: "Bool", value: true}));
    expect(read(env2, {parts:[{name:"hello"}]})).toMatchObject(Just({type: "Bool", value: false}));
});
