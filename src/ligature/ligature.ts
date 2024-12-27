import moo from "moo"

let lexer = moo.compile({
    WS:      /[ \t]+/,
    comment: /;.*?$/,
    element:  /[a-zA-Z_0-9]*/,
    string:  /"(?:\\["\\]|[^\n"\\])*"/,
    lparen:  '(',
    rparen:  ')',
    NL:      { match: /\n/, lineBreaks: true },
  })
