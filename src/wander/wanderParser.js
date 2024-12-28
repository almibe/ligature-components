// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
function id(x) { return x[0]; }

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
let Lexer = lexer;
let ParserRules = [
    {"name": "Script$ebnf$1", "symbols": ["Statement"], "postprocess": id},
    {"name": "Script$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Script$ebnf$2", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "Script$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Script$ebnf$3$subexpression$1$ebnf$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "Script$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Script$ebnf$3$subexpression$1$ebnf$2", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "Script$ebnf$3$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Script$ebnf$3$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "Script$ebnf$3$subexpression$1$ebnf$1", "Statement", "Script$ebnf$3$subexpression$1$ebnf$2"]},
    {"name": "Script$ebnf$3", "symbols": ["Script$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "Script$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Script$ebnf$4", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": id},
    {"name": "Script$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Script", "symbols": ["Script$ebnf$1", "Script$ebnf$2", "Script$ebnf$3", "Script$ebnf$4"], "postprocess": 
        function(d) {
          if (d[0] == null) {
            return []
          } else {
            return d[0]
          }
        }
        },
    {"name": "Statement", "symbols": ["Call"], "postprocess": 
        function(d) {
          return d[0]
        }
        },
    {"name": "Call$ebnf$1", "symbols": []},
    {"name": "Call$ebnf$1$subexpression$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS), "Any"]},
    {"name": "Call$ebnf$1", "symbols": ["Call$ebnf$1", "Call$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Call", "symbols": ["Element", "Call$ebnf$1"], "postprocess": 
        function(d) {
          return {
            type: "call",
            commandName: d[0].value,
            arguments: [],
          }
        }
        },
    {"name": "Any", "symbols": ["Element"]},
    {"name": "Any", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable)]},
    {"name": "Any", "symbols": [(lexer.has("literal") ? {type: "literal"} : literal)]},
    {"name": "Any", "symbols": ["Network"]},
    {"name": "Element", "symbols": [(lexer.has("element") ? {type: "element"} : element)], "postprocess": 
        function(d) {
          return { type: "element", value: d[0].value }
        } 
        },
    {"name": "Network$ebnf$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "Network$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Network", "symbols": [(lexer.has("obrace") ? {type: "obrace"} : obrace), "Network$ebnf$1", (lexer.has("cbrace") ? {type: "cbrace"} : cbrace)], "postprocess": 
        function (d) {
          return {type: "network", triples: []}
        }
        }
];
let ParserStart = "Script";
export default { Lexer, ParserRules, ParserStart };
