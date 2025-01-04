type token = {
  \"type": string,
  \"value": string,
}

@module("./WanderTokenizer.js") external reset: string => unit = "reset"

@module("./WanderTokenizer.js") external next: unit => Nullable.t<token> = "next"

let parseTokens: (unit) => array<Model.wanderValue> = () => {
  switch next() {
  | Value({ \"type": "element", value: value }) => [ Model.Element (Ligature.element(value)) ]
  | Value({ \"type": "variable", value: value }) => [ Model.Variable (Ligature.variable(value)) ]
  | Value({ \"type": "literal", value: value }) => [ Model.Literal (Ligature.literal(value)) ]
  | Value({ \"type": "pipe" }) => [ Pipe ]
  | Value({ \"type": "comma"}) => [ Comma ]
  | Undefined | Null => []
  | _ => raise(Failure("Unexpected value."))
  }
}

let parse = (script) => {
  reset(script)
  parseTokens()
}

// function readArguments(): WanderValue[] | null {
//   let token = readToken()
//   let args: WanderValue[] = []
//   let cont = true
//   while (cont) {
//     if (token != null && (token.type == "element" || token.type == "network")) {
//       args.push(token)
//       token = readToken()
//     } else if (token == null) {
//       cont = false
//     } else if (token.type == "comma") {
//       cont = false
//      }else {
//       return null
//     }
//   }
//   return args
// }

// function readCall(): Call | null {
//   let token = readToken()
//   if (token != null && token.type == "element") {
//     let commandName = token.value
//     let args = readArguments()
//     if (args == null) {
//       return null
//     } else {
//       return {
//         commandName: commandName,
//         type: "call",
//         arguments: args
//       }
//     }
//   } else {
//     return null
//   }
// }

let readTriple: () => Nullable.t<Ligature.triple> = () => {
  Null
}

//Note this function assumes that the opening brace has been read before calling
let readNetwork: () => Nullable.t<Ligature.network> = () => {

  Null
  // let next = readIgnoreWS()
  // let cont = ref(true)
  // let results = Set<Triple>()
  // while(cont) {
  //   switch next {
  //     | Null => {
  //       cont := false
  //     }
  //     | Value(value) => {

  //     }
  //   }


  //   if (next == null) {
  //     return null
  //   } else if (next.type == "comma") {
  //     next = readIgnoreWS()
  //   } else if (next.type == "element" || next.type == "variable") {
  //     let tokenToModel = (token) => {
  //       if (token.type == "element") {
  //         return element(token.value)
  //       } else if (token.type =="variable") {
  //         return variable(token.value)
  //       } else {
  //         throw "unexpected value"
  //       }
  //     }
  //     let el = tokenToModel(next)
  //     let attribute = readElementVariable()
  //     let value = readValue()
  //     if (attribute != null && value != null) {
  //       results = results.add(triple(el, attribute, value))
  //       next = readIgnoreWS()
  //     } else {
  //       return null
  //     }
  //   } else if (next.type == "cbrace") {
  //     cont = false
  //   } else {
  //     throw "unexpected token in readNetwork"
  //   }
  // }
  // return network(results)
}

let rec readIgnoreWS: () => Nullable.t<token> = () => {
  switch next() {
    | Value(value) => {
      if (value.\"type" == "ws") {
        readIgnoreWS()
      } else {
        Value(value)
      }
    }
    | Undefined | Null => {
      Null
    }
  }
}

//Reads an element or variable.
let readElementVariable: () => option<Ligature.elementPattern> = () => {
  switch readIgnoreWS() {
  | _ => None
  }
  // let cont = true
  // while (cont) {
  //   if (next == null) {
  //     return null
  //   } else if (next.type == 'element') {
  //     return element(next.value)
  //   } else if (next.type == 'variable') {
  //     return variable(next.value)
  //   } else {
  //     return null
  //   }
  // }
  // return null
}

// //Reads an element, literal, or variable.
// function readValue() {
//   let next = readIgnoreWS()
//   let cont = true
//   while (cont) {
//     if (next == null) {
//       return null
//     } else if (next.type == 'element') {
//       return element(next.value)
//     } else if (next.type == 'variable') {
//       return variable(next.value)
//     } else if (next.type == 'literal') {
//       return variable(next.value)
//     } else {
//       return null
//     }
//   }
//   return null
// }

let readToken: () => option<Model.wanderValue> = () => {
  None
  // let next = readIgnoreWS()
  // let cont = ref(true)
  // let res = ref(None)
  // while (cont.contents) {
  //   switch next {
  //     | Null => {
  //       cont := false
  //       res := None
  //     }
  //     | Value(value) => {
  //       if (value.\"type" == "element") {
  //         res := Some(Ligature.element(value.value))
  //         cont := false
  //       } else if (value.\"type" == "obrace") {
  //         res := readNetwork()
  //         cont := false
  //       } else if (value.\"type" == "comma") {
  //         res := Some(Comma)
  //         cont := false
  //       } else {
  //         raise(Failure("TODO unexpected token type: " ++ value.\"type"))
  //       }
  //     }
  //   }
  // }
  // res.contents
}

// export function parse(script: string): any {
//   lexer.reset(script)
//   let result = []
//   let cont = true
//   while (cont) {
//     let res = readCall()
//     if (res == null) {
//       cont = false
//     } else {
//       result.push(res)
//     }
//   }
//   return result
// }
