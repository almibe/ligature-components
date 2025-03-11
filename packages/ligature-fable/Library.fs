open Wander.Main
open Wander.Interpreter
open Ligature.Model
open Wander.Model
open System.Collections.Generic
open Wander.Library
open Fable.Core.JsInterop
open Wander.InMemoryStore

let runWithFns (fns: Dictionary<string, Any array -> Result<Any, LigatureError>>) (script: string) =
    let mutable resFns = stdFns (new InMemoryStore())
    for entry in fns do
        resFns <- Map.add (Term entry.Key) (Fn({doc = ""; examples = []; args = ""; result = ""}, 
            fun _ _ args -> 
                entry.Value (List.toArray args))) resFns
    run resFns Map.empty script

let run = runWithDefaults

let printResult = printResult

let printAny = printAny

let ok value = Ok value

let error value = Error value

let networkToJs (value: Any) =
    match value with
    | Any.Network network ->
        let network = 
            Set.map
                (fun (Term e, Term a, v) ->
                    let element = createEmpty
                    element?``type`` <- "term"
                    element?value <- e

                    let role = createEmpty
                    role?``type`` <- "term"
                    role?value <- a

                    let value = createEmpty
                    value?``type`` <- 
                        match v with
                        | Value.Term _ -> "term"
                        | Value.Literal _ -> "literal"
                    value?value <- v
                    [| element; role; value |])
                network
        let network = Array.ofSeq network
        let obj = createEmpty
        obj?``type`` <- "network"
        obj?value <- network
        obj
    | _ -> failwith "Unexpected value."

let rec anyToJs (any: Any) =
    match any with
    | Any.Term (Term t) -> 
        let obj = createEmpty
        obj?``type`` <- "term"
        obj?value <- t
        obj
    | Any.Literal (Literal l) -> 
        let obj = createEmpty
        obj?``type`` <- "literal"
        obj?value <- l
        obj
    | Any.Network n -> networkToJs (Any.Network n)
    | Any.Quote q ->
        let res = 
            List.map (fun any -> anyToJs any) q
            |> List.toArray
        let obj = createEmpty
        obj?``type`` <- "quote"
        obj?value <- res
        obj
    | _ -> failwith "Invalid call to anyToJs"

let resultToJs (res: Result<Any, LigatureError>) =
    match res with
    | Error err -> 
        let obj = createEmpty
        obj?``type`` <- "error"
        obj?value <- err
        obj
    | Ok any -> anyToJs any
