module Wander.Model (
  Call,
  Assignment,
  Statement,
  Script,
  WanderValue,
  WanderValue(..),
  Quote,
  Command
) where

import Prelude
import Data.Set
import Data.List
import Ligature

type Call = 
  { type :: String
  , commandName :: String
  , arguments :: List WanderValue }

type Assignment = 
  { type :: String
  , variable :: Variable
  , value :: WanderValue }

data Statement = Call | Assignment

type Script = List Statement

data WanderValue = Element Element | Variable | Network | Literal | Quote

derive instance eqWanderValue :: Eq WanderValue

type Quote = List WanderValue

type Command = Unit -> Unit  --(local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, variables: Map<Variable, Element | Literal>, args: WanderValue[]) => WanderValue
