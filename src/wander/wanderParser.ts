import moo from "moo"
import { element } from "../ligature/ligature"

const lexer = moo.compile({
    ws:        { match: /[ \t\n\r]+/, lineBreaks: true },
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

export function parse(script: string): any {
  lexer.reset(script)
  let result = []
  for (let token of lexer) {
    throw "TODO"
  }
  return result
}
