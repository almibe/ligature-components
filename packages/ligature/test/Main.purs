module Test.Main where

import Wander.Parser
import Wander
import Wander.Model
import Ligature
import Prelude

import Test.Unit (suite, test, timeout)
import Test.Unit.Main (runTest)
import Test.Unit.Assert as Assert

main = runTest do
  suite "parser tests" do
    test "basic parsing" do
      Assert.equal' "parse empty string" (parse "") []
      Assert.equal' "parse element" (parse "hello") [Element (element "hello")]
      Assert.equal' "parse variable" (parse "?hello") [Variable (variable "?hello")]
      Assert.equal' "parse literal" (parse "\"hello\"") [Literal (literal "\"hello\"")]
      Assert.equal' "parse pipe" (parse "|") [Pipe]
    test "parse empty network" do
      Assert.equal' "" (parse "{}") [Network emptyNetwork]
    test "parse network with one triple" do
      Assert.equal' "" (parse "{a b c}") [Network emptyNetwork]
    test "parse network with multiple triples" do
      Assert.equal' "" (parse "{a b c, d e f, g h i}") [Network emptyNetwork]

  suite "script tests" do
    test "empty script" do
      Assert.equal' "" (run "") (Element (element "result"))
