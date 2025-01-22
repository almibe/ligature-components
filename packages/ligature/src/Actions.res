let stdActions: Belt.Map.String.t<Wander.action> = Belt.Map.String.fromArray([
    ("assert-equal", (networks, stack) => {
        switch stack {
        | list{left, right, ...tail} => {
            if left == right {
                Ok(networks, tail)
            } else {
                Error("Values not equal.")
            }
        }
        | _ => Error("assert-equal requires two values on stack.")
        }
    }),
    ("count", (networks, stack) => {
        switch stack {
        | list{ Ligature.Network(value), ...tail } => {
            Ok(networks, list{Ligature.Literal(Ligature.Literal.literal((value->Array.length)->Int.toString)), ...tail })
        }
        | _ => Error("count requires a network on top of the stack.")
        }
    })
])

// let coreModule = () => {
//   let res: mod = Belt.Map.String.empty
//   let res = res->Belt.Map.String.set("id", arguments => {
//     switch arguments {
//     | [arg] => Ok(Some(arg))
//     | _ => Error("id expects a single argument.")
//     }
//   })
//   res
// }

// let assertModule = () => {
//   let res: mod = Belt.Map.String.empty
//   let res = res->Belt.Map.String.set("assert-equal", arguments => {
//     switch arguments {
//     | [left, right] => {
//       Ok(None)
//     }
//     | _ => Error("id expects a single argument.")
//     }
//   })
//   res
// }

// let stdModules = () => {
//   let res: modules = Belt.Map.String.empty
//   let res = res->Belt.Map.String.set("core", coreModule())
//   let res = res->Belt.Map.String.set("assert", assertModule())
//   res
// }
