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
let readElementPattern: unit => Nullable.t<Ligature.ElementPattern.elementPattern> = () => {
  switch readIgnoreWS() {
  | Value({\"type": "element", value}) =>
    Value(Ligature.ElementPattern.Element(Ligature.Element.element(value)))
  | Value({\"type": "slot", value}) =>
    Value(Ligature.ElementPattern.Slot(Ligature.Slot.slot(value)))
  | _ => Null
  }
}

//Reads an element, literal, or slot.
let readValue: unit => Nullable.t<Ligature.Value.value> = () => {
  switch readIgnoreWS() {
  | Null => Null
  | Value({\"type": "element", value}) =>
    Value(Ligature.Value.VElement(Ligature.Element.element(value)))
  | Value({\"type": "slot", value}) => Value(Ligature.Value.VSlot(Ligature.Slot.slot(value)))
  | Value({\"type": "literal", value}) =>
    Value(Ligature.Value.VLiteral(Ligature.Literal.literal(value)))
  | _ => Null
  }
}

//Note this function assumes that the opening brace has been read before calling
let rec readNetwork: array<Ligature.Triple.triple> => Nullable.t<
  Ligature.Network.network,
> = triples => {
  switch readIgnoreWS() {
  | Null | Undefined => Null
  | Value({\"type": "cbrace"}) => Value(Ligature.Network.network(triples))
  | Value({\"type": "comma"}) => readNetwork(triples)
  | Value({\"type": "element", value: element}) =>
    switch (readElementPattern(), readValue()) {
    | (Value(role), Value(value)) => {
        triples->Array.push(
          Ligature.Triple.triple(
            Ligature.ElementPattern.Element(Ligature.Element.element(element)),
            role,
            value,
          ),
        )
        readNetwork(triples)
      }
    | (_, _) => Null
    }
  | Value({\"type": "slot", value: slot}) =>
    switch (readElementPattern(), readValue()) {
    | (Value(role), Value(value)) => {
        triples->Array.push(
          Ligature.Triple.triple(
            Ligature.ElementPattern.Slot(Ligature.Slot.slot(slot)),
            role,
            value,
          ),
        )
        readNetwork(triples)
      }
    | (_, _) => Null
    }
  }
}

let readArguments: unit => array<Model.wanderAtom> = () => {
  let token = ref(readIgnoreWS())
  let args: array<Model.wanderAtom> = []
  let cont = ref(true)
  while cont.contents {
    switch token.contents {
    | Value({\"type": "element", value}) => {
        args->Array.push(Model.Element(Ligature.Element.element(value)))
        token := readIgnoreWS()
      }
    | Value({\"type": "variable", value}) => {
        args->Array.push(Model.Variable(Model.Variable.variable(value)))
        token := readIgnoreWS()
    }
    | Value({\"type": "slot", value}) => {
        args->Array.push(Model.Slot(Ligature.Slot.slot(value)))
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
    | Value(unexpected) => {
        Console.log("Unexpected value")
        Console.log(unexpected)
      }
    }
  }
  args
}

let readQuote: unit => array<Model.wanderAtom> = () => {
  let token = ref(readIgnoreWS())
  let args: array<Model.wanderAtom> = []
  let cont = ref(true)
  while cont.contents {
    switch token.contents {
    | Value({\"type": "element", value}) => {
        args->Array.push(Model.Element(Ligature.Element.element(value)))
        token := readIgnoreWS()
      }
    | Value({\"type": "variable", value}) => {
        args->Array.push(Model.Variable(Model.Variable.variable(value)))
        token := readIgnoreWS()
    }
    | Value({\"type": "slot", value}) => {
        args->Array.push(Model.Slot(Ligature.Slot.slot(value)))
        token := readIgnoreWS()
      }
    | Value({\"type": "obrace"}) => {
        switch readNetwork([]) {
        | Value(value) => args->Array.push(Model.Network(value))
        | Null | Undefined => raise(Failure("Unexpected value while reading network."))
        }
        token := readIgnoreWS()
      }
    | Value({\"type": "cparen"}) => cont := false
    | Null => cont := false
    | Value(unexpected) => {
        Console.log("Unexpected value")
        Console.log(unexpected)
      }
    }
  }
  args
}

let readAssignment: string => Nullable.t<Model.expression> = name => {
  let equals = readIgnoreWS()
  switch equals {
  | Value({\"type": "equalSign"}) => {
    switch readArguments() {
    | [] => raise(Failure("Invalid expression."))
    | contents => {
      Value({\"type": "assignment", variableName: name, contents: contents})
    }
    | _ => raise(Failure("Invalid expression."))
    }
  }
  | Null => {
    Null
  }
  }
}

let readAtoms: unit => array<Model.wanderAtom> = () => {
  let atoms: array<Model.wanderAtom> = []
  let cont = ref(true)
  while cont.contents {
    switch readIgnoreWS() {
    | Value({\"type": "element", value}) => atoms->Array.push(Model.Element({\"type": "element", value}))
    | Value({\"type": "literal", value}) => atoms->Array.push(Model.Literal({\"type": "literal", value}))
    | Value({\"type": "comma"}) => atoms->Array.push(Model.Comma)
    | Value({\"type": "equalSign"}) => atoms->Array.push(Model.EqualSign)
    | Undefined | Null => cont := false
    | Value({\"type": "variable", value}) => atoms->Array.push(Model.Variable({\"type": "variable", value}))
    | Value({\"type": "slot", value}) => atoms->Array.push(Model.Slot({\"type": "slot", value}))
    | Value({\"type": "obrace"}) => {
        switch readNetwork([]) {
        | Value(value) => atoms->Array.push(Model.Network(value))
        | Null | Undefined => raise(Failure("Unexpected value while reading network."))
        }
      }
    | Value({\"type": "oparen"}) => {
        let quote = readQuote()
        atoms->Array.push(Model.Quote(quote))
    }
    }
  }
  atoms
}

let parseScript: array<Model.wanderAtom> => Model.script = atoms => {
  let res: array<Model.expression> = []
  let cont = ref(true)
  let offset = ref(0)
  while cont.contents {
    switch atoms->Array.get(offset.contents) {
    | Some(Model.Variable({\"type": "variable", value: variableName})) => {
      offset := offset.contents + 1
      switch atoms->Array.get(offset.contents) {
      | Some(Model.EqualSign) => {
        offset := offset.contents + 1
        let results = []
        let innerCont = ref(true)
        while innerCont.contents {
          switch atoms->Array.get(offset.contents) {
          | Some(Model.Comma) => {
            offset := offset.contents + 1
            innerCont := false
          }
          | Some(value) => {
            results->Array.push(value)
            offset := offset.contents + 1
          }
          | None => {
            offset := offset.contents + 1
            innerCont := false
          }
          }
        }
        res->Array.push({\"type": "expression", variableName: variableName, contents: results})
      }
      | _ => raise(Failure("Invalid assignment."))
      }      
    }
    | Some(Model.Element({\"type": "element", value})) => {
        offset := offset.contents + 1
        let results = [Model.Element({\"type": "element", value})]
        let innerCont = ref(true)
        while innerCont.contents {
          switch atoms->Array.get(offset.contents) {
          | Some(Model.Comma) => {
            offset := offset.contents + 1
            innerCont := false
          }
          | Some(value) => {
            results->Array.push(value)
            offset := offset.contents + 1
          }
          | None => {
            offset := offset.contents + 1
            innerCont := false
          }
          }
        }
        res->Array.push({\"type": "expression", variableName: "", contents: results})
      }
    | None => cont := false
    }
  //   switch readIgnoreWS() {
  //   | Value({\"type": "comma"}) => ()
  //   | Undefined | Null => cont := false
  //   | Value({\"type": "variable", value}) => {
  //       let assignment = readAssignment(value)
  //       switch assignment {
  //       | Null => raise(Failure("Unexpected problem reading assignment."))
  //       | Value(assignment) => res->Array.push((assignment))
  //       }
  //     }
  //   | unexpected => {
  //       Console.log("Error")
  //       Console.log(unexpected)
  //     }
  //   }
  }
  res
}

let parse = script => {
  reset(script)
  let atoms = readAtoms()
  parseScript(atoms)
}

let readTriple: unit => Nullable.t<Ligature.Triple.triple> = () => {
  Null
}

let readToken: unit => option<Model.wanderAtom> = () => {
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
