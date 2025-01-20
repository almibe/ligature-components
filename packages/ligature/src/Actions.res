
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

