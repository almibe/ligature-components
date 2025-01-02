module Wander.Model where

import Prelude
import Data.Set
import Data.List

type Call = 
  { type :: String
  , commandName :: String
  , arguments :: List WanderValue }

type Assignment = {

}

data Statement = Call | Assignment

data WanderValue = Element | Variable | Network | Literal | Quote

type Quote = List WanderValue

-- type Command = (local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, variables: Map<Variable, Element | Literal>, args: WanderValue[]) => WanderValue
