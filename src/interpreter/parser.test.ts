import { expect, test } from 'vitest'
import { parse } from './parser.ts';
import { Right } from 'purify-ts';

test('parse Int', () => {
	const result = parse("45");
	expect(result).toStrictEqual(Right([{ value: 45n, type: "Int" }]));
});

test('parse String', () => {
	const result = parse(`"Hello, World!"`);
	expect(result).toStrictEqual(Right([{ value: "Hello, World!", type: "String"}]));
});

test("parse Bool", () => {
	const result = parse(`true`);
	expect(result).toStrictEqual(Right([{ value: true, type: "Bool"}]));
});

test("parse Module", () => {
	const result = parse(`{x = 5}`);
	expect(result).toStrictEqual(Right([{ value: new Map([["x", {value: 5n, type: "Int"}]]), type: "Module"}]));
})