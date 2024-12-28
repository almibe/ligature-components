@preprocessor esmodule

@{%
import moo from "moo"

const lexer = moo.compile({
    WS:       { match: /[ \t\n\r]+/, lineBreaks: true },
    comment:  /;.*?$/,
    element:  /[a-zA-Z_0-9]+/,
    variable: /\?[a-zA-Z_0-9]+/,
    literal:  /"(?:\\["\\]|[^\n"\\])*"/,
    obrace:   '{',
    cbrace:   '}',
    oparen:   '(',
    cparen:   ')',
    comma:    ',',
    equalSign: '=',
  })
%}

@lexer lexer

Script -> Statement # %WS? (Statement %WS? %comma (Statement))
Statement -> Call
Call -> %element (%WS Any):*
Any -> %element | %variable | %literal # todo add Network
# Network -> %obrace %WS? %cbrace
# Assignment -> %variable %WS %equalSign %WS Any
