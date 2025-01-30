open Wander.Main
open Ligature.Model
open Wander.Model
open System.Collections.Generic
open Wander.Library
open Fable.Core.JsInterop

let runWithActions (actions: Dictionary<string, Stack -> Result<Stack, LigatureError>>) (script: string) =
    let mutable resActions = stdActions
    for entry in actions do
        resActions <- Map.add (Element entry.Key) (Action.Stack ({doc = ""},entry.Value)) resActions
    run resActions Map.empty List.empty script

let run = runWithDefaults

let printResult = printResult

let printStack = printStack

let printAny = printAny

let resultToStack (result: Result<Networks * Stack, string>) =
    let mutable res = [||]
    match result with
    | Ok(_, stack) -> 
        res <- Array.ofList stack
    | _ -> ()
    result

let ok value = Ok value

let error value = Error value

let headTail stack =
    match stack with
    | [] -> (None, [])
    | head :: tail -> (Some head, tail)

let networkToJs (value: Any) =
    match value with
    | Any.Network network ->
        let network = 
            Set.map
                (fun (e, a, v) ->
                    let e =
                        match e with
                        | ElementPattern.Element(Element e) ->
                            let obj = createEmpty
                            obj?``type`` <- "element"
                            obj?value <- e
                            obj
                        | ElementPattern.Variable(Variable v) ->
                            let obj = createEmpty
                            obj?``type`` <- "variable"
                            obj?value <- v
                            obj

                    let a =
                        match a with
                        | ElementPattern.Element(Element e) ->
                            let obj = createEmpty
                            obj?``type`` <- "element"
                            obj?value <- e
                            obj
                        | ElementPattern.Variable(Variable v) ->
                            let obj = createEmpty
                            obj?``type`` <- "variable"
                            obj?value <- v
                            obj

                    let v =
                        match v with
                        | Value.Element(Element e) ->
                            let obj = createEmpty
                            obj?``type`` <- "element"
                            obj?value <- e
                            obj
                        | Value.Variable(Variable v) ->
                            let obj = createEmpty
                            obj?``type`` <- "variable"
                            obj?value <- v
                            obj
                        | Value.Literal l ->
                            let obj = createEmpty
                            obj?``type`` <- "literal"
                            obj?value <- l
                            obj
                    [| e; a; v |])
                network
        Array.ofSeq network
    | _ -> failwith "Unexpected value."

let readNetwork (networkName: string) (result: Result<Networks * Stack, string>) =
    match result with
    | Ok(networks, _) ->
        match Map.tryFind (NetworkName networkName) networks with
        | Some(network) -> networkToJs (Any.Network network)
        | None -> failwith "Network not found."
    | Error err -> failwith err
