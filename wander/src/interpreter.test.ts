import { expect, test } from 'vitest'
import { printResult, run } from './interpreter.ts';
import { Right } from 'purify-ts';
import { WanderValue } from './values.ts';
import { std } from './modules/library.ts';

const env = std();

function evalAndCheck(script: string, expected: WanderValue) {
	const result = run(script, env);
	if (result.isLeft()) {
		throw result.leftOrDefault("");
	} else {
		expect(result.unsafeCoerce()[0]).toEqual(expected);
	}
}

test("print Int", () => {
	expect(printResult(Right([{type: "Int", value: 4n}, std()]))).toEqual("4")
})

test("print empty Array", () => {
	expect(printResult(Right([{type: "Array", value: []}, std()]))).toEqual("[]")
})

test("print empty Module", () => {
	expect(printResult(Right([{type: "Module", value: new Map()}, std()]))).toEqual("{}")
})

test('eval Int', () => {
	evalAndCheck("45", { value: 45n, type: "Int" });
});

test('eval String', () => {
	evalAndCheck(`"Hello, World!"`, { value: "Hello, World!", type: "String"});
});

test('eval Int as expression', () => {
	evalAndCheck("45,", { value: 45n, type: "Int" });
});

test('eval String as expression', () => {
	evalAndCheck(`"Hello, World!",`, { value: "Hello, World!", type: "String"});
});

test("eval script of literals", () => {
	evalAndCheck(`5, "hello"`, { value: "hello", type: "String"});
});

test("eval empty Array", () => {
	evalAndCheck(`[]`, { value: [], type: "Array"});
});

test("eval Array with 1 value", () => {
	evalAndCheck(`[1]`, { value: [{type: "Int", value: 1n}], type: "Array"});
});

test("eval Array", () => {
	evalAndCheck(`[1, 4]`, { value: [{type: "Int", value: 1n}, {type: "Int", value: 4n}], type: "Array"});
});

test("eval empty Module", () => {
	evalAndCheck("{}", { value: new Map(), type: "Module"});
});

test("eval Module with one field", () => {
	evalAndCheck(`{hello = "world"}`, { value: new Map([["hello", {type: "String", "value": "world"}]]), type: "Module"});
});

test("eval Module with multiple fields", () => {
	evalAndCheck(`{hello = "world", x = 5, y = 6}`, { value: new Map([
		["hello", {type: "String", "value": "world"}],
		["x", {type: "Int", "value": 5n}],
		["y", {type: "Int", "value": 6n}],
	]), type: "Module"});
});

test("eval binding", () => {
	evalAndCheck("x = 5", {
		type: "Int", value: 5n
	})
})

test("eval binding with reference", () => {
	evalAndCheck("x = 5, x", {
		type: "Int", value: 5n
	})
})

test("eval Grouping", () => {
	evalAndCheck("(1,2,3)", {
		type: "Int", value: 3n
	})
})
