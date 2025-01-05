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

//Reads an element or slot.
let readElementPattern: unit => Nullable.t<Ligature.elementPattern> = () => {
  switch readIgnoreWS() {
  | Value({\"type": "element", value}) => Value(Ligature.Element(Ligature.element(value)))
  | Value({\"type": "slot", value}) => Value(Ligature.Slot(Ligature.slot(value)))
  | _ => Null
  }
}

//Reads an element, literal, or slot.
let readValue: unit => Nullable.t<Ligature.value> = () => {
  switch readIgnoreWS() {
  | Null => Null
  | Value({\"type": "element", value}) => Value(Ligature.VElement(Ligature.element(value)))
  | Value({\"type": "slot", value}) => Value(Ligature.VSlot(Ligature.slot(value)))
  | Value({\"type": "literal", value}) => Value(Ligature.VLiteral(Ligature.literal(value)))
  | _ => Null
  }
}

//Note this function assumes that the opening brace has been read before calling
let rec readNetwork: array<Ligature.triple> => Nullable.t<Ligature.network> = triples => {
  switch readIgnoreWS() {
  | Null | Undefined => Null
  | Value({\"type": "cbrace"}) => Value(Ligature.network(triples))
  | Value({\"type": "comma"}) => readNetwork(triples)
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
  | Value({\"type": "slot", value: slot}) =>
    switch (readElementPattern(), readValue()) {
    | (Value(role), Value(value)) => {
        triples->Array.push(Ligature.triple(Ligature.Slot(Ligature.slot(slot)), role, value))
        readNetwork(triples)
      }
    | (_, _) => Null
    }
  }
}

let readArguments: unit => array<Model.wanderValue> = () => {
  let token = ref(readIgnoreWS())
  let args: array<Model.wanderValue> = []
  let cont = ref(true)
  while cont.contents {
    switch token.contents {
    | Value({\"type": "element", value}) => {
        args->Array.push(Model.Element(Ligature.element(value)))
        token := readIgnoreWS()
      }
    | Value({\"type": "slot", value}) => {
        args->Array.push(Model.Slot(Ligature.slot(value)))
        token := readIgnoreWS()
      }
    | Value({\"type": "obrace"}) => {
        switch readNetwork([]) {
        | Value(value) => args->Array.push(Model.Network(value))
        | Null | Undefined => raise(Failure("Unexpected value while reading network."))
        }
        token := readIgnoreWS()
      }
    | Value({\"type": "comma"}) => cont := false
    | Null => cont := false
    }
  }
  args
}

let readCall: string => Nullable.t<Model.call> = name => {
  let args = readArguments()
  Value(Model.call(name, args))
}

let parseScript: unit => Model.script = () => {
  let res = []
  let cont = ref(true)
  while cont.contents {
    switch readIgnoreWS() {
    | Value({\"type": "element", value}) => {
        let c = readCall(value)
        switch c {
        | Null => raise(Failure("Unexpected problem reading call."))
        | Value(c) => res->Array.push(c)
        }
      }
    | Value({\"type": "comma"}) => ()
    | Undefined | Null => cont := false
    | x => {
        Console.log("Error")
        Console.log(x)
      }
    }
  }
  res
}

let parse = script => {
  reset(script)
  parseScript()
}

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
