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
      Assert.equal' "parse empty script" (parse "") []
      Assert.equal' "parse single element" (parse "hello") [Element (element "hello")]
      Assert.equal' "parse single variable" (parse "?hello") [Variable (variable "?hello")]
      Assert.equal' "parse single literal" (parse "\"hello\"") [Literal (literal "\"hello\"")]
      Assert.equal' "parse pipe" (parse "|") [Pipe]
  suite "script tests" do
    test "empty script" do
      Assert.assert "Run empty script" $ (run "") == Element (element "result")
