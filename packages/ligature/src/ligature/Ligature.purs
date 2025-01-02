module Ligature
  (
    element,
    variable,
    literal
  )
where

import Prelude
import Data.Set

type Element =
  { value :: String 
  , type :: String }

type Variable =
  { value :: String 
  , type :: String }

type Literal =
  { value :: String 
  , type :: String }

element :: String -> Element
element value = { value : value, type : "element" }

variable :: String -> Variable
variable value = { value : value, type : "variable" }

literal :: String -> Literal
literal value = { value : value, type : "literal" }

data ElementPattern = Element Element | Variable Variable

data Value = VElement Element | VVariable Variable | VLiteral Literal

type Triple =
  { element :: ElementPattern
  , role :: ElementPattern
  , value :: Value }

type Network =
  { value :: Set Triple 
  , type :: String }

network :: Set Triple -> Network
network value = { value : value, type : "network" }
