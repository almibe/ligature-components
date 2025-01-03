module Wander.Parser
  ( parse
  ) where

import Data.Unit
import Ligature
import Wander.Model

type Token =
  { type :: String
  , value :: String
  }

foreign import reset :: String -> Unit

foreign import next :: Unit -> Token

parse :: String -> Array WanderValue
parse script = do
  let _ = reset script
  parseTokens unit

parseTokens :: Unit -> Array WanderValue
parseTokens _ =
  case next unit of
    { type: "element", value: value } -> [ Element (element value) ]
    { type: "variable", value: value } -> [ Variable (variable value) ]
    { type: "literal", value: value } -> [ Literal (literal value) ]
    { type: "pipe" } -> [ Pipe ]
    _ -> []

-- function readArguments(): WanderValue[] | null {
--   let token = readToken()
--   let args: WanderValue[] = []
--   let cont = true
--   while (cont) {
--     if (token != null && (token.type == "element" || token.type == "network")) {
--       args.push(token)
--       token = readToken()
--     } else if (token == null) {
--       cont = false
--     } else if (token.type == "comma") {
--       cont = false
--      }else {
--       return null
--     }
--   }
--   return args
-- }

-- function readCall(): Call | null {
--   let token = readToken()
--   if (token != null && token.type == "element") {
--     let commandName = token.value
--     let args = readArguments()
--     if (args == null) {
--       return null
--     } else {
--       return {
--         commandName: commandName,
--         type: "call",
--         arguments: args
--       }
--     }
--   } else {
--     return null
--   }
-- }

-- type Token = Element | Network | { type: "comma" }

-- //Note this function assumes that the opening brace has been read before calling
-- function readNetwork(): Network | null {
--   let next = readIgnoreWS()
--   let cont = true
--   let results = Set<Triple>()
--   while(cont) {
--     if (next == null) {
--       return null
--     } else if (next.type == "comma") {
--       next = readIgnoreWS()
--     } else if (next.type == "element" || next.type == "variable") {
--       let tokenToModel = (token) => {
--         if (token.type == "element") {
--           return element(token.value)
--         } else if (token.type =="variable") {
--           return variable(token.value)
--         } else {
--           throw "unexpected value"
--         }
--       }
--       let el = tokenToModel(next)
--       let attribute = readElementVariable()
--       let value = readValue()
--       if (attribute != null && value != null) {
--         results = results.add(triple(el, attribute, value))
--         next = readIgnoreWS()
--       } else {
--         return null
--       }
--     } else if (next.type == "cbrace") {
--       cont = false
--     } else {
--       throw "unexpected token in readNetwork"
--     }
--   }
--   return network(results)
-- }

-- function readIgnoreWS(): any | null {
--   let next = lexer.next()
--   let cont = true
--   while (cont) {
--     if (next == null) {
--       return null
--     } else if (next.type == 'ws') {
--       next = lexer.next()
--     } else {
--       return next
--     }
--   }
--   return null
-- }

-- //Reads an element or variable.
-- function readElementVariable() {
--   let next = readIgnoreWS()
--   let cont = true
--   while (cont) {
--     if (next == null) {
--       return null
--     } else if (next.type == 'element') {
--       return element(next.value)
--     } else if (next.type == 'variable') {
--       return variable(next.value)
--     } else {
--       return null
--     }
--   }
--   return null
-- }

-- //Reads an element, literal, or variable.
-- function readValue() {
--   let next = readIgnoreWS()
--   let cont = true
--   while (cont) {
--     if (next == null) {
--       return null
--     } else if (next.type == 'element') {
--       return element(next.value)
--     } else if (next.type == 'variable') {
--       return variable(next.value)
--     } else if (next.type == 'literal') {
--       return variable(next.value)
--     } else {
--       return null
--     }
--   }
--   return null
-- }

-- function readToken(): Token | null {
--   let next = readIgnoreWS()
--   let cont = true
--   while (cont) {
--     if (next == null) {
--       return null
--     } else if (next.type == 'element') {
--       return element(next.value)
--     } else if (next.type == 'obrace') {
--       return readNetwork()
--     } else if (next.type == 'comma') {
--       return next
--     } else {
--       throw "TODO unexpected token " + next.type
--     }
--   }
--   return null
-- }

-- export function parse(script: string): any {
--   lexer.reset(script)
--   let result = []
--   let cont = true
--   while (cont) {
--     let res = readCall()
--     if (res == null) {
--       cont = false
--     } else {
--       result.push(res)
--     }
--   }
--   return result
-- }
