type sideEffect = (Ligature.wanderAtom) => ()

let textAction: (sideEffect) => Wander.action = (textCb) => (networks, stack) => {
    textCb(List.head(stack)->Option.getUnsafe)
    Console.log(List.head(stack))
    Ok(networks, List.tail(stack)->Option.getUnsafe)
}

let tableAction: (sideEffect) => Wander.action = (textCb) => (networks, stack) => {
    textCb(List.head(stack)->Option.getUnsafe)
    Console.log(List.head(stack))
    Ok(networks, List.tail(stack)->Option.getUnsafe)
}

let graphAction: (sideEffect) => Wander.action = (textCb) => (networks, stack) => {
    textCb(List.head(stack)->Option.getUnsafe)
    Console.log(List.head(stack))
    Ok(networks, List.tail(stack)->Option.getUnsafe)
}

let componentActions: (sideEffect, sideEffect, sideEffect) => Belt.Map.String.t<Wander.action> = ( textCb, tableCb, graphCb ) => {
    Belt.Map.String.fromArray([
//         ("log", (networks, stack) => {
//             switch stack {
//             | list{value, ...tail} => {
//                 switch value {
//                 | _ => Console.log(value)
// //                | Literal(literal) => Console.log(literal)
//                 }
//                 Ok(networks, tail)
//             }
//             | _ => Error("assert-equal requires two values on stack.")
//             }
//         }),
        ("display-text", textAction(textCb)),

            // switch stack {
            // | list{value, ...tail} => {
            //     textCb(value)
            //     %todo
            //     //Ok(networks, tail)
            // }
            // | _ => Error("Invalid call to display-text")
            // }
        //    switch stack {
        //    | list{value, ...tail} => {
        //        //textCb(value)
        //     //    (() => {textCb(value)})()

        //        Console.log(value)
        //        Ok(networks, tail)

        //         // %todo
        //     }
        //    | _ => Error("Error")
        //    }
        //    Ok(networks, stack)
        ("display-table", tableAction(tableCb)),
        ("display-graph", graphAction(graphCb))
    ])
}