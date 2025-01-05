open Ava

test("parse empty string", t => {
  t->Assert.deepEqual(WanderParser.parse(""), [])
})

test("parse single call with no args", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test"),
    [
      {
        \"type": "call",
        commandName: "test",
        arguments: [],
      },
    ],
  )

  // t->Assert.deepEqual(WanderParser.parse("?hello"), [Model.Variable(Ligature.variable("?hello"))])

  // t->Assert.deepEqual(
  //   WanderParser.parse("\"hello literal\""),
  //   [Model.Literal(Ligature.literal("\"hello literal\""))],
  // )
  // t->Assert.deepEqual(WanderParser.parse("|"), [Model.Pipe])
  // t->Assert.deepEqual(WanderParser.parse(","), [Model.Comma])
})

test("parse single call with single arg", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test 1"),
    [
      {
        \"type": "call",
        commandName: "test",
        arguments: [Model.Element(Ligature.element("1"))],
      },
    ],
  )
})

test("parse single call with multiple args", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test 1 2 3"),
    [
      {
        \"type": "call",
        commandName: "test",
        arguments: [
          Model.Element(Ligature.element("1")),
          Model.Element(Ligature.element("2")),
          Model.Element(Ligature.element("3")),
        ],
      },
    ],
  )
})

test("parse single call with variable arg", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test ?var"),
    [
      {
        \"type": "call",
        commandName: "test",
        arguments: [Model.Variable(Ligature.variable("?var"))],
      },
    ],
  )
})

test("parse single call with emppy network arg", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test {}"),
    [
      {
        \"type": "call",
        commandName: "test",
        arguments: [Model.Network(Ligature.network([]))],
      },
    ],
  )
})

test("parse single call with network arg", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test {a b c}"),
    [
      {
        \"type": "call",
        commandName: "test",
        arguments: [
          Model.Network(
            Ligature.network([
              Ligature.triple(
                Ligature.Element(Ligature.element("a")),
                Ligature.Element(Ligature.element("b")),
                Ligature.VElement(Ligature.element("c")),
              ),
            ]),
          ),
        ],
      },
    ],
  )
})

// test("parse network with single triple", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("{a b c}"),
//     [
//       Model.Network(
//         Ligature.network([
//           Ligature.triple(
//             Ligature.Element(Ligature.element("a")),
//             Ligature.Element(Ligature.element("b")),
//             Ligature.VElement(Ligature.element("c")),
//           ),
//         ]),
//       ),
//     ],
//   )
// })

// test("parse network with two triples", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("{a b c, a b d}"),
//     [
//       Model.Network(
//         Ligature.network([
//           Ligature.triple(
//             Ligature.Element(Ligature.element("a")),
//             Ligature.Element(Ligature.element("b")),
//             Ligature.VElement(Ligature.element("c")),
//           ),
//           Ligature.triple(
//             Ligature.Element(Ligature.element("a")),
//             Ligature.Element(Ligature.element("b")),
//             Ligature.VElement(Ligature.element("d")),
//           ),
//         ]),
//       ),
//     ],
//   )
// })

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
