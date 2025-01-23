open Ava

// test("parse empty string", t => {
//   t->Assert.deepEqual(WanderParser.parse(""), [])
// })

// test("parse single element", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("test"),
//     [
//       {
//         Model.\"type": "expression",
//         variableName: "",
//         contents: [Model.Element(Ligature.Element.element("test"))],
//       },
//     ],
//   )
// })

// test("parse single call with single arg", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("test 1"),
//     [
//       {
//         \"type": "expression",
//         variableName: "",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Element(Ligature.Element.element("1")),
//         ],
//       },
//     ],
//   )
// })

// test("parse single call with multiple args", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("test 1 2 3"),
//     [
//       {
//         \"type": "expression",
//         variableName: "",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Element(Ligature.Element.element("1")),
//           Model.Element(Ligature.Element.element("2")),
//           Model.Element(Ligature.Element.element("3")),
//         ],
//       },
//     ],
//   )
// })

// test("parse single call with slot arg", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("test ?var"),
//     [
//       {
//         \"type": "expression",
//         variableName: "",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Slot(Ligature.Slot.slot("?var")),
//         ],
//       },
//     ],
//   )
// })

// test("parse single call with empty network arg", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("test {}"),
//     [
//       {
//         \"type": "expression",
//         variableName: "",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Network(Ligature.Network.network([])),
//         ],
//       },
//     ],
//   )
// })

test("parse network name", t => {
  t->Assert.deepEqual(
    WanderParser.parse("*test"),
    Ok([NetworkName(Ligature.NetworkName.networkName("*test"))]),
  )
})

test("parse literal", t => {
  t->Assert.deepEqual(WanderParser.parse("\"0\""), Ok([Literal(Ligature.Literal.literal("0"))]))
})

test("empty network", t => {
  t->Assert.deepEqual(WanderParser.parse("{}"), Ok([Network([])]))
})

test("network with single triple", t => {
  t->Assert.deepEqual(
    WanderParser.parse("{a b c}"),
    Ok([
      Network([
        Ligature.triple(
          Element(Ligature.Element.element("a")),
          Element(Ligature.Element.element("b")),
          VElement(Ligature.Element.element("c")),
        ),
      ]),
    ]),
  )
})

test("network with two triples", t => {
  t->Assert.deepEqual(
    WanderParser.parse("{a b c, d e f}"),
    Ok([
      Network([
        Ligature.triple(
          Element(Ligature.Element.element("a")),
          Element(Ligature.Element.element("b")),
          VElement(Ligature.Element.element("c")),
        ),
        Ligature.triple(
          Element(Ligature.Element.element("d")),
          Element(Ligature.Element.element("e")),
          VElement(Ligature.Element.element("f")),
        ),
      ]),
    ]),
  )
})

test("network with quote as value", t => {
  t->Assert.deepEqual(
    WanderParser.parse("{a b [c]}"),
    Ok([
      Network([
        Ligature.triple(
          Element(Ligature.Element.element("a")),
          Element(Ligature.Element.element("b")),
          VQuote([Ligature.Element(Ligature.Element.element("c"))]),
        ),
      ]),
    ]),
  )
})

// test("parse single call with network arg", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("test {a b c}"),
//     [
//       {
//         \"type": "expression",
//         variableName: "",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Network(
//             Ligature.Network.network([
//               Ligature.Triple.triple(
//                 Ligature.ElementPattern.Element(Ligature.Element.element("a")),
//                 Ligature.ElementPattern.Element(Ligature.Element.element("b")),
//                 Ligature.VElement(Ligature.Element.element("c")),
//               ),
//             ]),
//           ),
//         ],
//       },
//     ],
//   )
// })

// test("parse network with two triples", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("test {a b c, d e f}"),
//     [
//       {
//         \"type": "expression",
//         variableName: "",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Network(
//             Ligature.Network.network([
//               Ligature.Triple.triple(
//                 Ligature.ElementPattern.Element(Ligature.Element.element("a")),
//                 Ligature.ElementPattern.Element(Ligature.Element.element("b")),
//                 Ligature.VElement(Ligature.Element.element("c")),
//               ),
//               Ligature.Triple.triple(
//                 Ligature.ElementPattern.Element(Ligature.Element.element("d")),
//                 Ligature.ElementPattern.Element(Ligature.Element.element("e")),
//                 Ligature.VElement(Ligature.Element.element("f")),
//               ),
//             ]),
//           ),
//         ],
//       },
//     ],
//   )
// })

// test("parse network with slots", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("test {?a b ?c, d ?e f}"),
//     [
//       {
//         \"type": "expression",
//         variableName: "",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Network(
//             Ligature.Network.network([
//               Ligature.Triple.triple(
//                 Ligature.ElementPattern.Slot(Ligature.Slot.slot("?a")),
//                 Ligature.ElementPattern.Element(Ligature.Element.element("b")),
//                 Ligature.VSlot(Ligature.Slot.slot("?c")),
//               ),
//               Ligature.Triple.triple(
//                 Ligature.ElementPattern.Element(Ligature.Element.element("d")),
//                 Ligature.ElementPattern.Slot(Ligature.Slot.slot("?e")),
//                 Ligature.VElement(Ligature.Element.element("f")),
//               ),
//             ]),
//           ),
//         ],
//       },
//     ],
//   )
// })

// test("parse script with multiple calls", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("test 1, test 2"),
//     [
//       {
//         \"type": "expression",
//         variableName: "",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Element(Ligature.Element.element("1")),
//         ],
//       },
//       {
//         \"type": "expression",
//         variableName: "",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Element(Ligature.Element.element("2")),
//         ],
//       },
//     ],
//   )
// })

// test("parse assignment", t => {
//   t->Assert.deepEqual(
//     WanderParser.parse("$var = test 1"),
//     [
//       {
//         \"type": "expression",
//         variableName: "$var",
//         contents: [
//           Model.Element(Ligature.Element.element("test")),
//           Model.Element(Ligature.Element.element("1")),
//         ],
//       },
//     ],
//   )
// })
