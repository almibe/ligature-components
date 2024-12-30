import { element } from '../ligature/ligature.ts'
import { parse } from './wander.ts'
import { expect, test } from 'vitest'

test('parse empty script', () => {
  expect(parse("")).toStrictEqual([])
})

test('parse script with single call, no args', () => {
  expect(parse("test")).toStrictEqual([{
    type: "call",
    commandName: "test",
    arguments: []
  }])
})

test('parse empty network', () => {
  expect(parse("test {}")).toStrictEqual([{
    type: "call",
    commandName: "test",
    arguments: [
      {
        type: "network",
        triples: [],
      }
    ]
  }])
})

test('parse script with single call, multiple args', () => {
  expect(parse("test 1 2 3")).toStrictEqual([{
    type: "call",
    commandName: "test",
    arguments: [element("1"),element("2"),element("3") ]
  }])
})

// test('parse script with multiple calls', () => {
//   expect(parse("test 1, test 2")).toStrictEqual([{
//     type: "call",
//     commandName: "test",
//     arguments: [element("1") ]
//   }, {
//     type: "call",
//     commandName: "test",
//     arguments: [element("2") ]
//   }])
// })
