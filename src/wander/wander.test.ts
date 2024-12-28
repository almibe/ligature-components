import { element } from '../ligature/ligature.ts'
import { run, parse } from './wander.ts'
import { expect, test } from 'vitest'

test('run empty script', () => {
  expect(run("")).toStrictEqual({})
})

test('call id command', () => {
  expect(run("id test")).toStrictEqual(element("test"))
})

// test('parse script with single call, multiple args', () => {
//   expect(parse("test 1 2 3")).toStrictEqual([{
//     type: "call",
//     commandName: "test",
//     arguments: [{
//       type: "element",
//       value: "1"
//     }, {
//       type: "element",
//       value: "2"
//     }, {
//       type: "element",
//       value: "3"
//     }]
//   }])
// })
