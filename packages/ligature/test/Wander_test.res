open Ava

test("run empty script", t => {
  t->Assert.deepEqual(Wander.run(""), Ok(None))
})

test("call id command", t => {
  t->Assert.deepEqual(
    Wander.run("core.id test"),
    Ok(Some(Model.Element(Ligature.Element.element("test")))),
  )
})

test("allow multiple calls", t => {
  t->Assert.deepEqual(
    Wander.run("core.id test, core.id test2"),
    Ok(Some(Model.Element(Ligature.Element.element("test2")))),
  )
})

@module("./TestUtils.js") external readTests: unit => array<array<string>> = "readTests"

readTests()->Array.forEach(file => {
  test("Running " ++ file[0]->Option.getUnsafe, t => {
    t->Assert.isTrue(Wander.run(file[1]->Option.getUnsafe)->Result.isOk)
  })
})
