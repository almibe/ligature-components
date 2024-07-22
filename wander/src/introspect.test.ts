import { expect, test } from 'vitest'
import { printResult, run } from './interpreter.ts';
import { Right } from 'purify-ts';
import { WanderValue } from './values.ts';
import { std } from './modules/library.ts';
import { inspect } from './introspect.ts';

test("inspect empty script", () => {
	expect(inspect("")).toEqual({
		script: "",
		expressions: Right([])
	})
})
