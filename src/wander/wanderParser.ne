@preprocessor esmodule

@{%
import moo from "moo"
import { element } from "../ligature/ligature"

const lexer = moo.compile({
    WS:        { match: /[ \t\n\r]+/, lineBreaks: true },
    comment:   /;.*?$/,
    element:   /[a-zA-Z_0-9]+/,
    variable:  /\?[a-zA-Z_0-9]+/,
    literal:   /"(?:\\["\\]|[^\n"\\])*"/,
    obrace:    '{',
    cbrace:    '}',
    oparen:    '(',
    cparen:    ')',
    comma:     ',',
    equalSign: '=',
  })
%}

@lexer lexer

Script -> Statement:? %WS:? (%comma %WS:? Statement %WS:?):? %comma:? {%
  function(d) {
    if (d[0] == null) {
      return []
    } else {
      return d[0]
    }
  }
%}

Statement -> Call {%
  function(d) {
    return d
  }
%}

Call -> Element Arguments {%
  function(d) {
    let args = []
    if (d[1] != undefined) {
      args = d[1]
    }
    return {
      type: "call",
      commandName: d[0].value,
      arguments: args,
    }
  }
%}

Arguments -> Argument:* {%
  function(d) {
    return d[0]
  }
%}

Argument -> %WS Any {%
  function(d) {
    return (d[1][0])
  }
%}

Any -> Element | %variable | %literal | Network | Quote {%
  function(d) {
    return d[0]
  }
%}

Element -> %element {%
  function(d) {
    return element(d[0].value)
  } 
%}

Network -> %obrace %WS:? %cbrace {%
  function (d) {
    return {type: "network", triples: []}
  }
%}

Quote -> %oparen %WS:? %cparen {%
  function (d) {
    return {type: "quote", values: []}
  }
%}

# Assignment -> %variable %WS %equalSign %WS Any
