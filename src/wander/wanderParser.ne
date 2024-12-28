@preprocessor esmodule

@{%
import moo from "moo"

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
    return d[0]
  }
%}

Call -> Element (%WS Any):* {%
  function(d) {
    return {
      type: "call",
      commandName: d[0].value,
      arguments: [],
    }
  }
%}

Any -> Element | %variable | %literal | Network

Element -> %element {%
  function(d) {
    return { type: "element", value: d[0].value }
  } 
%}

Network -> %obrace %WS:? %cbrace {%
  function (d) {
    return {type: "network", triples: []}
  }
%}

# Assignment -> %variable %WS %equalSign %WS Any
