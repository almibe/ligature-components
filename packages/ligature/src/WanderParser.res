type token = {
  \"type": string,
  value: string,
}

@module("./WanderTokenizer.js") external reset: string => unit = "reset"

@module("./WanderTokenizer.js") external next: unit => Nullable.t<token> = "next"

let rec readIgnoreWS: unit => Nullable.t<token> = () => {
  switch next() {
  | Value(value) =>
    if value.\"type" == "ws" {
      readIgnoreWS()
    } else {
      Value(value)
    }
  | Undefined | Null => Null
  }
}

//Reads an element or variable.
let readElementPattern: unit => Nullable.t<Ligature.elementPattern> = () => {
  switch readIgnoreWS() {
  | Value({\"type": "element", value}) => Value(Ligature.Element(Ligature.element(value)))
  | Value({\"type": "variable", value}) => Value(Ligature.Variable(Ligature.variable(value)))
  | _ => Null
  }
}

//Reads an element, literal, or variable.
let readValue: unit => Nullable.t<Ligature.value> = () => {
  switch readIgnoreWS() {
  | Null => Null
  | Value({\"type": "element", value}) => Value(Ligature.VElement(Ligature.element(value)))
  | Value({\"type": "variable", value}) => Value(Ligature.VVariable(Ligature.variable(value)))
  | Value({\"type": "literal", value}) => Value(Ligature.VLiteral(Ligature.literal(value)))
  | _ => Null
  }
}

//Note this function assumes that the opening brace has been read before calling
let rec readNetwork: array<Ligature.triple> => Nullable.t<Ligature.network> = triples => {
  switch readIgnoreWS() {
  | Null | Undefined => Null
  | Value({\"type": "cbrace"}) => Value(Ligature.network(triples))
  | Value({\"type": "element", value: element}) =>
    switch (readElementPattern(), readValue()) {
    | (Value(role), Value(value)) => {
        triples->Array.push(
          Ligature.triple(Ligature.Element(Ligature.element(element)), role, value),
        )
        readNetwork(triples)
      }
    | (_, _) => Null
    }
  | Value({\"type": "variable", value: variable}) =>
    switch (readElementPattern(), readValue()) {
    | (Value(role), Value(value)) => {
        triples->Array.push(
          Ligature.triple(Ligature.Variable(Ligature.variable(variable)), role, value),
        )
        readNetwork(triples)
      }
    | (_, _) => Null
    }
  }

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

let parseTokens: unit => array<Model.wanderValue> = () => {
  let res = []
  switch next() {
  | Value({\"type": "element", value}) => res->Array.push(Model.Element(Ligature.element(value)))
  | Value({\"type": "variable", value}) => res->Array.push(Model.Variable(Ligature.variable(value)))
  | Value({\"type": "literal", value}) => res->Array.push(Model.Literal(Ligature.literal(value)))
  | Value({\"type": "pipe"}) => res->Array.push(Pipe)
  | Value({\"type": "comma"}) => res->Array.push(Comma)
  | Undefined | Null => ()
  | Value({\"type": "obrace"}) =>
    switch readNetwork([]) {
    | Value(value) => res->Array.push(Model.Network(value))
    | Null | Undefined => raise(Failure("Unexpected value while reading network."))
    }
  | _ => raise(Failure("Unexpected value while reading tokens."))
  }
  res
}

let parse = script => {
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

let readTriple: unit => Nullable.t<Ligature.triple> = () => {
  Null
}

let readToken: unit => option<Model.wanderValue> = () => {
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
