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

test("parse single call with slot arg", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test ?var"),
    [
      {
        \"type": "call",
        commandName: "test",
        arguments: [Model.Slot(Ligature.slot("?var"))],
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

test("parse network with two triples", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test {a b c, d e f}"),
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
              Ligature.triple(
                Ligature.Element(Ligature.element("d")),
                Ligature.Element(Ligature.element("e")),
                Ligature.VElement(Ligature.element("f")),
              ),
            ]),
          ),
        ],
      },
    ],
  )
})

test("parse network with slots", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test {?a b ?c, d ?e f}"),
    [
      {
        \"type": "call",
        commandName: "test",
        arguments: [
          Model.Network(
            Ligature.network([
              Ligature.triple(
                Ligature.Slot(Ligature.slot("?a")),
                Ligature.Element(Ligature.element("b")),
                Ligature.VSlot(Ligature.slot("?c")),
              ),
              Ligature.triple(
                Ligature.Element(Ligature.element("d")),
                Ligature.Slot(Ligature.slot("?e")),
                Ligature.VElement(Ligature.element("f")),
              ),
            ]),
          ),
        ],
      },
    ],
  )
})

test("parse script with multiple calls", t => {
  t->Assert.deepEqual(
    WanderParser.parse("test 1, test 2"),
    [
      {
        \"type": "call",
        commandName: "test",
        arguments: [Model.Element(Ligature.element("1"))],
      },
      {
        \"type": "call",
        commandName: "test",
        arguments: [Model.Element(Ligature.element("2"))],
      },
    ],
  )
})
