import { expect, test, suite } from 'vitest'
import { printResult, run } from './interpreter.ts';
import { Right } from 'purify-ts';
import { newEnvironment } from './environment.ts';
import { WanderValue } from './values.ts';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';
import * as fs from 'fs';
const env = newEnvironment();

function evaluateResults(results: WanderValue, scriptName: string) {
	if (results.type == "Array") {
		results.value.forEach(result => {
			if (result.type == "Module") {
				test(result.value["name"], () => {
					const test = result.value["test"];
					const expected = result.value["expect"];
					expect(test).toEqual(expected);
				});
			} else {
				test('Error: Expected Array of Modules from test script.', () => { throw 'Error: Expected Array of Modules from test script.' });
			}
		});
	} else {
		test('Error: Expected Array from test script.', () => { throw 'Error: Expected Array from test script.' });
	}
}

if (process.env.WANDER_TEST_SUITE != undefined) {
	const dir = process.env.WANDER_TEST_SUITE;
	console.log(dir);
	const testScripts = globSync(dir + "/**.test.wander");
	testScripts.forEach(scriptFile => {
		suite(scriptFile, () => {
			const script = fs.readFileSync(scriptFile, 'utf-8');
			try {
				const result = run(script, env)
				if (result.isLeft()) {
					test('Error running script', () => { throw result.toString() });
				} else {
					evaluateResults(result.unsafeCoerce()[0], scriptFile);
				}
			} catch (e) {
				test('Error reading file', () => { throw e });
			}
		})
	});
} else {
	test('Skipping Script Suite since WANDER_TEST_DIR was not set.', () => {});
}
