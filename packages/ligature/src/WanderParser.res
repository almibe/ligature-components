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
          Ligature.triple(
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
          Ligature.triple(Ligature.ElementPattern.Slot(Ligature.Slot.slot(slot)), role, value),
        )
        readNetwork(triples)
      }
    | (_, _) => Null
    }
  }
}

//Reads an element, literal, or slot.
and readValue: unit => Nullable.t<Ligature.value> = () => {
  switch readIgnoreWS() {
  | Null => Null
  | Value({\"type": "element", value}) => Value(Ligature.VElement(Ligature.Element.element(value)))
  | Value({\"type": "slot", value}) => Value(Ligature.VSlot(Ligature.Slot.slot(value)))
  | Value({\"type": "literal", value}) => Value(Ligature.VLiteral(Ligature.Literal.literal(value)))
  | Value({\"type": "oparen"}) => {
      let value = readQuote()
      Value(Ligature.VQuote(value))
    }
  | _ => Null
  }
}

and readQuote: unit => array<Ligature.wanderAtom> = () => {
  let token = ref(readIgnoreWS())
  let args: array<Ligature.wanderAtom> = []
  let cont = ref(true)
  while cont.contents {
    switch token.contents {
    | Value({\"type": "element", value}) => {
        args->Array.push(Ligature.Element(Ligature.Element.element(value)))
        token := readIgnoreWS()
      }
    | Value({\"type": "slot", value}) => {
        args->Array.push(Ligature.Slot(Ligature.Slot.slot(value)))
        token := readIgnoreWS()
      }
    | Value({\"type": "obrace"}) => {
        switch readNetwork([]) {
        | Value(value) => args->Array.push(Ligature.Network(value))
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

// let readArguments: unit => array<Ligature.wanderAtom> = () => {
//   let token = ref(readIgnoreWS())
//   let args: array<Model.wanderAtom> = []
//   let cont = ref(true)
//   while cont.contents {
//     switch token.contents {
//     | Value({\"type": "element", value}) => {
//         args->Array.push(Model.Element(Ligature.Element.element(value)))
//         token := readIgnoreWS()
//       }
//     | Value({\"type": "slot", value}) => {
//         args->Array.push(Model.Slot(Ligature.Slot.slot(value)))
//         token := readIgnoreWS()
//       }
//     | Value({\"type": "obrace"}) => {
//         switch readNetwork([]) {
//         | Value(value) => args->Array.push(Model.Network(value))
//         | Null | Undefined => raise(Failure("Unexpected value while reading network."))
//         }
//         token := readIgnoreWS()
//       }
//     | Value({\"type": "comma"}) => cont := false
//     | Null => cont := false
//     | Value(unexpected) => {
//         Console.log("Unexpected value")
//         Console.log(unexpected)
//       }
//     }
//   }
//   args
// }

let readAtoms: unit => array<Ligature.wanderAtom> = () => {
  let atoms: array<Ligature.wanderAtom> = []
  let cont = ref(true)
  while cont.contents {
    switch readIgnoreWS() {
    | Value({\"type": "element", value}) =>
      atoms->Array.push(Ligature.Element({\"type": "element", value}))
    | Value({\"type": "literal", value}) =>
      atoms->Array.push(Ligature.Literal({\"type": "literal", value}))
    | Value({\"type": "comma"}) => atoms->Array.push(Ligature.Comma)
    | Undefined | Null => cont := false
    | Value({\"type": "slot", value}) => atoms->Array.push(Ligature.Slot({\"type": "slot", value}))
    | Value({\"type": "comment"}) => ()
    | Value({\"type": "obrace"}) =>
      switch readNetwork([]) {
      | Value(value) => atoms->Array.push(Ligature.Network(value))
      | Null | Undefined => raise(Failure("Unexpected value while reading network."))
      }
    | Value({\"type": "oparen"}) => {
        let quote = readQuote()
        atoms->Array.push(Ligature.Quote(quote))
      }
    }
  }
  atoms
}

let parseScript: array<Ligature.wanderAtom> => result<Ligature.script, string> = atoms => {
  let res: array<Ligature.network> = []
  let cont = ref(true)
  let offset = ref(0)
  while cont.contents {
    switch atoms->Array.get(offset.contents) {
    | Some(Ligature.Network({\"type": "network", value})) => {
        offset := offset.contents + 1
        res->Array.push(Ligature.network(value))
      }
    | Some(_) => raise(Failure("Error"))
    | None => cont := false
    }
  }
  Ok(res)
}

let parse = script => {
  reset(script)
  let atoms = readAtoms()
  parseScript(atoms)
}

let readTriple: unit => Nullable.t<Ligature.triple> = () => {
  Null
}
