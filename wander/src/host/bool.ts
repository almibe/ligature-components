import { Right } from "purify-ts";
import { HostFunction } from "../values";

export const boolFunctions: HostFunction[] = [
    {
        fieldPath: {parts: [{name: "Bool"}, {name: "not"}]},
        docString: "",
        parameters: [{field:{name:"bool"}, tag: {}}],
        resultTag: {},
        fn: (args, environment) => {
            return Right([{type: "bool", value: true}, environment])
        },
        type: "HostFunction",
    }
];
