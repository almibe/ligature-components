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

let networkToJs (network : Network) =
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
                value?value <-
                    match v with
                    | Value.Term (Term t) -> t
                    | Value.Literal (Literal l) -> l
                    | _ -> failwith "TODO"
                [| element; role; value |])
            network
    let network = Array.ofSeq network
    let obj = createEmpty
    obj?``type`` <- "network"
    obj?value <- network
    obj

let rec recordToJs (record: Record) =
    let record =
        Seq.fold
            (fun state (key, value) ->
                match key with
                | Any.Term (Term t) ->
                    emitJsExpr (t, anyToJs value) "state[$0] = $1"
                    state
                | _ -> failwith "Unsupported record key.")
            (emitJsExpr () "{}")
            (Map.toSeq record)
    let obj = createEmpty
    obj?``type`` <- "record"
    obj?value <- record
    obj

and setToJs (set: AnySet) =
    let value = 
        Array.map (fun value ->
            anyToJs value)
            (Set.toArray set)
    let obj = createEmpty
    obj?``type`` <- "set"
    obj?value <- value
    obj

and anyToJs (any: Any) =
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
    | Any.Network n -> networkToJs n
    | Any.Quote q ->
        let res = 
            List.map (fun any -> anyToJs any) q
            |> List.toArray
        let obj = createEmpty
        obj?``type`` <- "quote"
        obj?value <- res
        obj
    | Any.Record record -> recordToJs record
    | Any.AnySet set -> setToJs set
    | x -> failwith $"Invalid call to anyToJs: {x}"

let resultToJs (res: Result<Any, LigatureError>) =
    match res with
    | Error err -> 
        let obj = createEmpty
        obj?``type`` <- "error"
        obj?value <- err
        obj
    | Ok any -> anyToJs any
