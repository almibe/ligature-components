open Wander.Main
open Ligature.Model
open Wander.Model
open System.Collections.Generic
open Wander.Library

let runWithActions (actions: Dictionary<string, Stack -> Result<Stack, LigatureError>>) (script: string) =
    let mutable resActions = stdActions
    for entry in actions do
        resActions <- Map.add (Element entry.Key) (Action.Stack entry.Value) resActions
    run resActions Map.empty List.empty script

let run = runWithDefaults

let printResult = printResult

let resultToStack (result: Result<Networks * Stack, string>) =
    let mutable res = [||]
    match result with
    | Ok(_, stack) -> 
        res <- Array.ofList stack
    | _ -> ()
    result
