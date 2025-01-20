import moo from "moo"

const lexer = moo.compile({
    ws:           { match: /[ \t\n\r]+/, lineBreaks: true },
    comment:      /;.*?$/,
    element:      /[a-zA-Z_0-9\.-]+/,
    slot:         /\?[a-zA-Z_0-9]+/,
    variable:     /\$[a-zA-Z_0-9]+/,
    networkName:  /\*[a-zA-Z_0-9]+/,
    literal:      { match: /"(?:\\["\\]|[^"\\])*"/, lineBreaks: true },
    obrace:       '{',
    cbrace:       '}',
    oparen:       '(',
    cparen:       ')',
    osquare:      '[',
    csquare:      ']',
    comma:        ',',
    equalSign:    '=',
  })

export function reset(input) {
  lexer.reset(input)
}

export function next() {
  return lexer.next()
}
