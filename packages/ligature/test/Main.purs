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
    test "empty script" do
      Assert.assert "parse empty script" $ (parse "") == []
      Assert.assert "parse single element" $ (parse "hello") == [Element (element "hello")]
    
      -- Assert.assertFalse "2 + 2 shouldn't be 5" $ (2 + 2) == 5
      -- Assert.equal 4 (2 + 2)
      -- Assert.expectFailure "2 + 2 shouldn't be 5" $ Assert.equal 5 (2 + 2)
  suite "script tests" do
    test "empty script" do
      Assert.assert "Run empty script" $ (run "") == Element (element "result")
