// __tests__/Main_test.res
open Ava

test("parse empty string", t => {
  t->Assert.is((WanderParser.parse("")), ())
})
