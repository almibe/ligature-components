// __tests__/Main_test.res
open Ava

test("foo", t => {
  t->Assert.pass
})

asyncTest("bar", t => {
  Promise.resolve("bar")->Promise.thenResolve(bar => {
    t->Assert.is(bar, "bar")
  })
})
