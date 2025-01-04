open Ava

test("parse empty string", t => {
  t->Assert.deepEqual((WanderParser.parse("")), [])
})

test("basic parsing", t => {
  t->Assert.deepEqual((WanderParser.parse("test")), [Model.Element(Ligature.element("test"))])
  t->Assert.deepEqual((WanderParser.parse("?hello")), [Model.Variable(Ligature.variable("?hello"))])
  t->Assert.deepEqual((WanderParser.parse("\"hello literal\"")), [Model.Literal(Ligature.literal("\"hello literal\""))])
  t->Assert.deepEqual((WanderParser.parse("|")), [Model.Pipe])
  t->Assert.deepEqual((WanderParser.parse(",")), [Model.Comma])
})

// test("parse networks", t => {
  
// })

  // suite "parser tests" do
  //   test "parse empty network" do
  //     Assert.equal' "" (parse "{}") [Network emptyNetwork]
  //   test "parse network with one triple" do
  //     Assert.equal' "" (parse "{a b c}") [Network emptyNetwork]
  //   test "parse network with multiple triples" do
  //     Assert.equal' "" (parse "{a b c, d e f, g h i}") [Network emptyNetwork]


// test("parse script with single call, no args", t => {
//   t->Assert.deepEqual(WanderParser.parse("test"), [{
//     "type": "call",
//     "commandName": "test",
//     "arguments": []
//   }])
// })

// test("parse script with single call, single arg", t => {
//   t->Assert.deepEqual(WanderParser.parse("test 1"), [{
//     "type": "call",
//     "commandName": "test",
//     "arguments": [element("1") ]
//   }])
// })

// test("parse empty network", t => {
//   t->Assert.deepEqual(WanderParser.parse("test {}"), [{
//     "type": "call",
//     "commandName": "test",
//     "arguments": [
//       network(Set())
//     ]
//   }])
// })

// test("parse single triple network", t => {
//   t->Assert.deepEqual(WanderParser.parse("test {a b c}"), [{
//     "type": "call",
//     "commandName": "test",
//     "arguments": [
//       network(Set([
//         triple(element("a"), element("b"), element("c"))
//       ]))
//     ]
//   }])
// })

// test("parse network", t => {
//   t->Assert.deepEqual(WanderParser.parse("test {a b c, d e f}"), [{
//     "type": "call",
//     "commandName": "test",
//     "arguments": [
//       network(Set([
//         triple(element("a"), element("b"), element("c")),
//         triple(element("d"), element("e"), element("f"))
//       ]))
//     ]
//   }])
// })

// test("parse network with variables", t => {
//   t->Assert.deepEqual(WanderParser.parse("test {?a b ?c, d ?e f}"), [{
//     "type": "call",
//     "commandName": "test",
//     "arguments": [
//       network(Set([
//         triple(variable("?a"), element("b"), variable("?c")),
//         triple(element("d"), variable("?e"), element("f"))
//       ]))
//     ]
//   }])
// })

// test("parse script with single call, multiple args", t => {
//   t->Assert.deepEqual(WanderParser.parse("test 1 2 3"), [{
//     "type": "call",
//     "commandName": "test",
//     "arguments": [element("1"),element("2"),element("3") ]
//   }])
// })

// test("parse script with multiple calls", t => {
//   t->Assert.deepEqual(WanderParser.parse("test 1, test 2"), [{
//     "type": "call",
//     "commandName": "test",
//     "arguments": [element("1") ]
//   }, {
//     "type": "call",
//     "commandName": "test",
//     "arguments": [element("2") ]
//   }])
// })
