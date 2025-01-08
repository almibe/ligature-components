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
        arguments: [Model.Element(Ligature.Element.element("1"))],
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
          Model.Element(Ligature.Element.element("1")),
          Model.Element(Ligature.Element.element("2")),
          Model.Element(Ligature.Element.element("3")),
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
        arguments: [Model.Slot(Ligature.Slot.slot("?var"))],
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
        arguments: [Model.Network(Ligature.Network.network([]))],
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
            Ligature.Network.network([
              Ligature.Triple.triple(
                Ligature.ElementPattern.Element(Ligature.Element.element("a")),
                Ligature.ElementPattern.Element(Ligature.Element.element("b")),
                Ligature.Value.VElement(Ligature.Element.element("c")),
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
            Ligature.Network.network([
              Ligature.Triple.triple(
                Ligature.ElementPattern.Element(Ligature.Element.element("a")),
                Ligature.ElementPattern.Element(Ligature.Element.element("b")),
                Ligature.Value.VElement(Ligature.Element.element("c")),
              ),
              Ligature.Triple.triple(
                Ligature.ElementPattern.Element(Ligature.Element.element("d")),
                Ligature.ElementPattern.Element(Ligature.Element.element("e")),
                Ligature.Value.VElement(Ligature.Element.element("f")),
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
            Ligature.Network.network([
              Ligature.Triple.triple(
                Ligature.ElementPattern.Slot(Ligature.Slot.slot("?a")),
                Ligature.ElementPattern.Element(Ligature.Element.element("b")),
                Ligature.Value.VSlot(Ligature.Slot.slot("?c")),
              ),
              Ligature.Triple.triple(
                Ligature.ElementPattern.Element(Ligature.Element.element("d")),
                Ligature.ElementPattern.Slot(Ligature.Slot.slot("?e")),
                Ligature.Value.VElement(Ligature.Element.element("f")),
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
        arguments: [Model.Element(Ligature.Element.element("1"))],
      },
      {
        \"type": "call",
        commandName: "test",
        arguments: [Model.Element(Ligature.Element.element("2"))],
      },
    ],
  )
})
