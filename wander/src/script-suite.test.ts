import { expect, test, suite } from 'vitest'
import { printResult, run } from './interpreter.ts';
import { Right } from 'purify-ts';
import { newEnvironment } from './environment.ts';
import { WanderValue } from './values.ts';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';
import * as fs from 'fs';
import { std } from './modules/library.ts';

test(() => {})

// if (process.env.WANDER_TEST_SUITE != undefined) {
// 	const dir = process.env.WANDER_TEST_SUITE;
// 	const testScripts = globSync(dir + "/**.test.wander");
// 	testScripts.forEach(scriptFile => {
// 		suite(scriptFile, () => {
// 			const script = fs.readFileSync(scriptFile, 'utf-8');
// 			try {
// 				const result = run(script, std())
// 				if (result.isLeft()) {
// 					test('Error running script', () => { throw result.toString() });
// 				} else {
// 					//evaluateResults(result.unsafeCoerce()[0], scriptFile);
// 				}
// 			} catch (e) {
// 				test('Error reading file', () => { throw e });
// 			}
// 		})
// 	});
// } else {
// 	test('Skipping Script Suite since WANDER_TEST_DIR was not set.', () => {});
// }
