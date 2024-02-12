import { Right } from "purify-ts";
import { Environment, bindVariable, newEnvironment } from "../environment";
import { _ } from 'lodash';
import { boolModule } from "./bool";
import { hostLibrary } from "../libraries/host-library";

export function std(): Environment {
    //let env = newEnvironment([hostLibrary(boolFunctions)]);
    let env = newEnvironment([]);
    env = bindVariable(env, {name: "Bool"}, boolModule)
    // env = bindVariable(env, "eq", {
    //     type: "HostFunction",
    //     docString: "Test if two values are equal.",
    //     parameters: [{field: {name: "left"}, tag: {}}, {field: {name: "right"}, tag: {}}],
    //     resultTag: {},
    //     fn: (args, environment) => {
    //         let value = _.isMatch(args[0], args[1]);
    //         return Right([{type: "Bool", value}, environment]);
    //     },
    // })
    return env;
}
