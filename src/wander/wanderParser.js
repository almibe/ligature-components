// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
function id(x) { return x[0]; }

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
let Lexer = lexer;
let ParserRules = [
    {"name": "Script", "symbols": ["Statement"]},
    {"name": "Statement", "symbols": ["Call"]},
    {"name": "Call$ebnf$1", "symbols": []},
    {"name": "Call$ebnf$1$subexpression$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS), "Any"]},
    {"name": "Call$ebnf$1", "symbols": ["Call$ebnf$1", "Call$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Call", "symbols": [(lexer.has("element") ? {type: "element"} : element), "Call$ebnf$1"]},
    {"name": "Any", "symbols": [(lexer.has("element") ? {type: "element"} : element)]},
    {"name": "Any", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable)]},
    {"name": "Any", "symbols": [(lexer.has("literal") ? {type: "literal"} : literal)]}
];
let ParserStart = "Script";
export default { Lexer, ParserRules, ParserStart };
