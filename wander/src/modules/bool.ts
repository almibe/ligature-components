import { Left, Right } from "purify-ts";
import { HostFunction, ModuleValue } from "../values";

export const boolModule: ModuleValue = {
    type: "Module",
    value: new Map([[
        "not", {
            fieldPath: {parts: [{name: "Bool"}, {name: "not"}]},
            docString: "Perform a not operation on a Bool value.",
            parameters: [{field:{name:"Bool"}, tag: {}}],
            resultTag: {},
            fn: (args, environment) => {
                if (args.length == 1 && args[0].type == "Bool") {
                    return Right([{type: "Bool", value: !args[0].value}, environment])
                } else {
                    return Left("Incorrect arguments to Bool.not. " + JSON.stringify(args));
                }
            },
            type: "HostFunction",
        }
    ]])
};
