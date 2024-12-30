import { element, network } from '../ligature/ligature.ts'
import { parse } from './wanderParser.ts'
import { expect, test } from 'vitest'
import { Set } from 'immutable'

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

test('parse script with single call, single arg', () => {
  expect(parse("test 1")).toStrictEqual([{
    type: "call",
    commandName: "test",
    arguments: [element("1") ]
  }])
})

test('parse empty network', () => {
  expect(parse("test {}")).toStrictEqual([{
    type: "call",
    commandName: "test",
    arguments: [
      network(Set())
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

test('parse script with multiple calls', () => {
  expect(parse("test 1, test 2")).toStrictEqual([{
    type: "call",
    commandName: "test",
    arguments: [element("1") ]
  }, {
    type: "call",
    commandName: "test",
    arguments: [element("2") ]
  }])
})
