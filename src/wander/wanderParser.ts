import moo from "moo"
import { element, Element, network, Network } from "../ligature/ligature"
import { Call, WanderValue } from "./model"
import { Set } from "immutable"

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

function readArguments(): WanderValue[] | null {
  let token = readToken()
  let args = []
  let cont = true
  while (cont) {
    if (token != null && (token.type == "element" || token.type == "network")) {
      args.push(token)
      token = readToken()
    } else if (token == null) {
      return args
    } else {
      throw "TODO"
    }
  }
  return args
}

function readCall(): Call | null {
  let token = readToken()
  if (token != null && token.type == "element") {
    let commandName = token.value
    let args = readArguments()
    if (args == null) {
      return null
    } else {
      return {
        commandName: commandName,
        type: "call",
        arguments: args
      }
    }
  } else {
    return null
  }
}

type Token = Element | Network

//Note this function assumes that the opening brace has been read before calling
function readNetwork(): Network | null {
  console.log("in read network")
  let next = readIgnoreWS()
  if (next != null && next.type == "cbrace") {
    return network(Set())
  } else {
    throw "TODO"
  }
}

function readIgnoreWS(): any | null {
  let next = lexer.next()
  let cont = true
  while (cont) {
    if (next == null) {
      return null
    } else if (next.type == 'ws') {
      next = lexer.next()
    } else {
      return next
    }
  }
  return null
}

function readToken(): Token | null {
  let next = readIgnoreWS()
  let cont = true
  while (cont) {
    if (next == null) {
      return null
    } else if (next.type == 'element') {
      return element(next.value)
    } else if (next.type == 'obrace') {
      return readNetwork()
    } else {
      throw "TODO"
    }
  }
  return null
}

export function parse(script: string): any {
  lexer.reset(script)
  let result = []
  let cont = true
  while (cont) {
    let res = readCall()
    if (res == null) {
      cont = false
    } else {
      result.push(res)
    }
  }
  return result
}
