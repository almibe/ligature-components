import { expect, test } from 'vitest'
import { run } from './interpreter.ts';

test('eval Int', () => {
	const result = run("45");
	expect(result).toStrictEqual({ value: 45n, type: "Int" });
});

test('eval String', () => {
	const result = run(`"Hello, World!"`);
	expect(result).toStrictEqual({ value: "Hello, World!", type: "String"});
});

test("eval Bool", () => {
	const result = run(`true`);
	expect(result).toStrictEqual({ value: true, type: "Bool"});
});

test('eval Int as expression', () => {
	const result = run("45,");
	expect(result).toStrictEqual({ value: 45n, type: "Int" });
});

test('eval String as expression', () => {
	const result = run(`"Hello, World!",`);
	expect(result).toStrictEqual({ value: "Hello, World!", type: "String"});
});

test("eval Bool as expression", () => {
	const result = run(`true,`);
	expect(result).toStrictEqual({ value: true, type: "Bool"});
});

test("eval script of literals", () => {
	const result = run(`true, 5, "hello"`);
	expect(result).toStrictEqual({ value: "hello", type: "String"});
});
