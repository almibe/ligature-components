import { Right } from "purify-ts";
import { Environment, bindVariable, newEnvironment } from "./environment";
import { _ } from 'lodash';

export function std(): Environment {
    let env = newEnvironment();
    env = bindVariable(env, "eq", {
        type: "HostFunction",
        docString: "Test if two values are equal.",
        parameters: [{name: "left", tag: {}}, {name: "right", tag: {}}],
        resultTag: {},
        fn: (args, environment) => {
            let value = _.isMatch(args[0], args[1]);
            return Right([{type: "Bool", value}, environment]);
        },
    })
    return env;
}
