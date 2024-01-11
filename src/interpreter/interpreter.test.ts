import { expect, test } from 'vitest'
import { run } from './interpreter.ts';
import { Right } from 'purify-ts';

test('eval Int', () => {
	const result = run("45");
	expect(result).toEqual(Right({ value: 45n, type: "Int" }));
});

test('eval String', () => {
	const result = run(`"Hello, World!"`);
	expect(result).toEqual(Right({ value: "Hello, World!", type: "String"}));
});

test("eval Bool", () => {
	const result = run(`true`);
	expect(result).toEqual(Right({ value: true, type: "Bool"}));
});

test('eval Int as expression', () => {
	const result = run("45,");
	expect(result).toEqual(Right({ value: 45n, type: "Int" }));
});

test('eval String as expression', () => {
	const result = run(`"Hello, World!",`);
	expect(result).toEqual(Right({ value: "Hello, World!", type: "String"}));
});

test("eval Bool as expression", () => {
	const result = run(`true,`);
	expect(result).toEqual(Right({ value: true, type: "Bool"}));
});

test("eval script of literals", () => {
	const result = run(`true, 5, "hello"`);
	expect(result).toEqual(Right({ value: "hello", type: "String"}));
});

test("eval empty Array", () => {
	const result = run(`[]`);
	expect(result).toEqual(Right({ value: [], type: "Array"}));
});

test("eval Array with 1 value", () => {
	const result = run(`[1]`);
	expect(result).toEqual(Right({ value: [{type: "Int", value: 1n}], type: "Array"}));
});

test("eval Array", () => {
	const result = run(`[true, 4]`);
	expect(result).toEqual(Right({ value: [{type: "Bool", value: true}, {type: "Int", value: 4n}], type: "Array"}));
});

test("eval empty Module", () => {
	const result = run("{}");
	expect(result).toEqual(Right({ value: new Map(), type: "Module"}));
});

test("eval Module with one field", () => {
	const result = run(`{hello = "world"}`);
	expect(result).toEqual(Right({ value: new Map([["hello", {type: "String", "value": "world"}]]), type: "Module"}));
});

test("eval Module with multiple fields", () => {
	const result = run(`{hello = "world", x = 5, y = 6}`);
	console.log(result)
	expect(result).toEqual(Right({ value: new Map([
		["hello", {type: "String", "value": "world"}],
		["x", {type: "Int", "value": 5n}],
		["y", {type: "Int", "value": 6n}],
	]), type: "Module"}));
});
