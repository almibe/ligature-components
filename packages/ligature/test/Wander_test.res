open Ava

// test("read empty Network", t => {
//   t->Assert.deepEqual(Wander.readNetwork("{}"), Ok([]))
// })

// test("call id command", t => {
//   t->Assert.deepEqual(
//     Wander.run("core.id test"),
//     Ok(Some(Model.Element(Ligature.Element.element("test")))),
//   )
// })

// test("allow multiple calls", t => {
//   t->Assert.deepEqual(
//     Wander.run("core.id test, core.id test2"),
//     Ok(Some(Model.Element(Ligature.Element.element("test2")))),
//   )
// })

// test("run assignment", t => {
//   t->Assert.deepEqual(
//     Wander.run("$var = test"),
//     Ok(Some(Model.Element(Ligature.Element.element("test")))),
//   )
// })

// test("empty network result toJs", t => {
//   t->Assert.deepEqual(Wander.run("core.id {}")->Wander.toJs, #Network([]))
// })

// test("single triple network result toJs", t => {
//   t->Assert.deepEqual(
//     Wander.run("core.id {a b c}")->Wander.toJs,
//     #Network([
//       {
//         "type": "triple",
//         "element": {"type": "element", "value": "a"},
//         "role": {"type": "element", "value": "b"},
//         "value": {"type": "element", "value": "c"},
//       },
//     ]),
//   )
// })

// @module("./TestUtils.js") external readTests: unit => array<array<string>> = "readTests"

// readTests()->Array.forEach(file => {
//   test("Running " ++ file[0]->Option.getUnsafe, t => {
//     t->Assert.isTrue(Wander.run(file[1]->Option.getUnsafe)->Result.isOk)
//   })
// })
