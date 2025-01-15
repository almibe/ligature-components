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
let readElementPattern: unit => option<Ligature.ElementPattern.elementPattern> = () => {
  switch readIgnoreWS() {
  | Value({\"type": "element", value}) =>
    Some(Ligature.ElementPattern.Element(Ligature.Element.element(value)))
  | Value({\"type": "slot", value}) => Some(Ligature.ElementPattern.Slot(Ligature.Slot.slot(value)))
  | _ => None
  }
}

//Note this function assumes that the opening brace has been read before calling
let rec readNetwork: array<Ligature.triple> => option<Ligature.network> = triples => {
  switch readIgnoreWS() {
  | Null | Undefined => None
  | Value({\"type": "cbrace"}) => Some(triples)
  | Value({\"type": "comma"}) => readNetwork(triples)
  | Value({\"type": "element", value: element}) =>
    switch (readElementPattern(), readValue()) {
    | (Some(role), Some(value)) => {
        triples->Array.push(
          Ligature.triple(
            Ligature.ElementPattern.Element(Ligature.Element.element(element)),
            role,
            value,
          ),
        )
        readNetwork(triples)
      }
    | (_, _) => None
    }
  | Value({\"type": "slot", value: slot}) =>
    switch (readElementPattern(), readValue()) {
    | (Some(role), Some(value)) => {
        triples->Array.push(
          Ligature.triple(Ligature.ElementPattern.Slot(Ligature.Slot.slot(slot)), role, value),
        )
        readNetwork(triples)
      }
    | (_, _) => None
    }
  }
}

//Reads an element, literal, or slot.
and readValue: unit => option<Ligature.value> = () => {
  switch readIgnoreWS() {
  | Null => None
  | Value({\"type": "element", value}) => Some(Ligature.VElement(Ligature.Element.element(value)))
  | Value({\"type": "slot", value}) => Some(Ligature.VSlot(Ligature.Slot.slot(value)))
  | Value({\"type": "literal", value}) => Some(Ligature.VLiteral(Ligature.Literal.literal(value)))
  | Value({\"type": "obrace"}) => switch readNetwork([]) {
    | Some(network) => Some(Ligature.VNetwork(network))
    | None => None
    }
  | Value({\"type": "oparen"}) => {
      let value = readQuote()
      Some(Ligature.VQuote(value))
    }
  | _ => None
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
        | Some(value) => args->Array.push(Ligature.Network(value))
        | None => raise(Failure("Unexpected value while reading network."))
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
      | Some(value) => atoms->Array.push(Ligature.Network(value))
      | None => raise(Failure("Unexpected value while reading network."))
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
    | Some(Ligature.Network(value)) => {
        offset := offset.contents + 1
        res->Array.push(value)
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
