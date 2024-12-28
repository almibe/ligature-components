import { run } from './wander.ts'
import { expect, test } from 'vitest'

test('tokenize empty script', () => {
  // run("")

  expect(run("")).toStrictEqual({})
})
