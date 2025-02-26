open Wander.Main
open Wander.Interpreter
open Ligature.Model
open Wander.Model
open System.Collections.Generic
open Wander.Library
open Fable.Core.JsInterop

let runWithFns (fns: Dictionary<string, Any array -> Result<Any, LigatureError>>) (script: string) =
    failwith "TODO"
    // let mutable resFns = stdFns
    // for entry in fns do
    //     resFns <- Map.add (Term entry.Key) (Fn({doc = ""; examples = []; pre = ""; post = ""}, 
    //         fun _ _ args -> 
    //             entry.Value (List.toArray args))) resFns
    // run resFns Map.empty script

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
                (fun (Term e, Term a, Term v) ->
                    let element = createEmpty
                    element?``type`` <- "term"
                    element?value <- e

                    let role = createEmpty
                    role?``type`` <- "term"
                    role?value <- a

                    let value = createEmpty
                    value?``type`` <- "term"
                    value?value <- v
                    [| element; role; value |])
                network
        Array.ofSeq network
    | _ -> failwith "Unexpected value."

let rec anyToJs (any: Any) =
    match any with
    | Any.Term l -> 
        let obj = createEmpty
        obj?``type`` <- "term"
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
