open Wander.Main
open Ligature.Model
open Wander.Model
open System.Collections.Generic
open Wander.Library
open Fable.Core.JsInterop

let runWithActions (actions: Dictionary<string, Stack -> Result<Stack, LigatureError>>) (script: string) =
    let mutable resActions = stdActions
    for entry in actions do
        resActions <- Map.add (Element entry.Key) (Action.Stack ({doc = ""; examples = []},entry.Value)) resActions
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

let rec anyToJs (any: Any) =
    match any with
    | Any.Literal l -> 
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
    | _ -> failwith "TODO"

let topOfStack (result: Result<Networks * Stack, LigatureError>) =
    match result with
    | Ok(_, stack) -> 
        match stack with
        | head :: _ -> anyToJs head
        | _ -> failwith "TODO"
    | Error err -> failwith err.UserMessage
