import { expect, test } from 'vitest'
import { run } from './interpreter.ts';
import { WanderValue } from './values.ts';
import { std } from './library.ts';

function evalAndCheck(script: string, expected: WanderValue) {
	const result = run(script, std());
	if (result.isLeft()) {
		throw result.leftOrDefault("");
	} else {
		expect(result.unsafeCoerce()[0]).toEqual(expected);
	}
}

test("eval eq", () => {
	evalAndCheck(`eq [] []`, { value: true, type: "Bool"});
});
