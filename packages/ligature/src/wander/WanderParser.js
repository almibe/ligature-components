import moo from "moo"

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
    pipe:      '|',
    equalSign: '=',
  })

export function reset(input) {
  lexer.reset(input)
}

export function next() {
  let next = lexer.next()
  if (next == null) {
    return {
      type: "end",
      value: ""
    }
  } else {
    return next
  }
}
