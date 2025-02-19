open Wander.Main
open Wander.Interpreter
open Ligature.Model
open Wander.Model
open System.Collections.Generic
open Wander.Library
open Fable.Core.JsInterop

let runWithActions (actions: Dictionary<string, Stack -> Result<Stack, LigatureError>>) (script: string) =
    let mutable resActions = stdActions
    for entry in actions do
        resActions <- Map.add (Element entry.Key) (Action.Stack ({doc = ""; examples = []; pre = ""; post = ""},entry.Value)) resActions
    run resActions List.empty script

let run = runWithDefaults

let printResult = printResult

let printStack = printStack

let printAny = printAny

let resultToStack (result: Result<Stack, string>) =
    let mutable res = [||]
    match result with
    | Ok(stack) -> 
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
                    [| e; a; v |])
                network
        Array.ofSeq network
    | _ -> failwith "Unexpected value."

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

let topOfStack (result: Result<Stack, LigatureError>) =
    match result with
    | Ok(stack) -> 
        match stack with
        | head :: _ -> anyToJs head
        | _ -> failwith "TODO"
    | Error err -> failwith err.UserMessage
