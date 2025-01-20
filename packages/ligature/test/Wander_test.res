open Ava

test("script with empty network", t => {
  t->Assert.deepEqual(
    Wander.run("{}", Actions.stdActions, Ligature.emptyNetworks),
    Ok(Ligature.emptyNetworks, list{Ligature.Network([])}),
  )
})

@module("./TestUtils.js") external readTests: unit => array<array<string>> = "readTests"

readTests()->Array.forEach(file => {
  test("Running " ++ file[0]->Option.getUnsafe, t => {
    t->Assert.isTrue(
      Wander.run(
        file[1]->Option.getUnsafe,
        Actions.stdActions,
        Ligature.emptyNetworks,
      )->Result.isOk,
    )
  })
})
