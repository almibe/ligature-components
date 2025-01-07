type mod = Belt.Map.String.t<Model.command>
type modules = Belt.Map.String.t<Belt.Map.String.t<Model.command>>

let coreModule = () => {
  let res: mod = Belt.Map.String.empty
  let res = res->Belt.Map.String.set("id", arguments => {
    switch arguments {
    | [arg] => Ok(Some(arg))
    | _ => Error("id expects a single argument.")
    }
  })
  res
}

let stdModules = () => {
  let res: modules = Belt.Map.String.empty
  let res = res->Belt.Map.String.set("core", coreModule())
  res
}

// export const defaultLocals: Map<Element, Command> = Map(
//   [[element("id"), (l, m, v, a) => {
//     if (a.length == 1) {
//       return a[0]
//     } else {
//       throw "id command expects one argument."
//     }
//   }],
//   [element("union"), (l, m, v, a) => {
//     if (a.length == 2) {

//       return a[0]
//     } else {
//       throw "union command expects two arguments."
//     }
//   }]]
// )

// export const stdModules = Map()
