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
