import { run, parse } from './wander.ts'
import { expect, test } from 'vitest'

test('tokenize empty script', () => {
  expect(parse("")).toStrictEqual([])
})

test('tokenize script with single call', () => {
  expect(parse("test")).toStrictEqual([{
    type: "call",
    commandName: "test",
    arguments: []
  }])
})

// test('tokenize script with single call', () => {
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
