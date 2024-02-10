import { expect, test } from 'vitest'
import { printResult, run } from './interpreter.ts';
import { Right } from 'purify-ts';
import { WanderValue } from './values.ts';
import { std } from './host/library.ts';
import { introspect } from './introspect.ts';

test("introspect empty script", () => {
	expect(introspect("")).toEqual({
		script: "",
		tokens: [],
		expressions: []
	})
})
