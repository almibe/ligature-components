import { Just, Left, Right, Nothing } from "purify-ts";
import { FieldPath, HostFunction, WanderValue } from "../values";
import { ModuleLibrary } from "./module-library";
import { _ } from 'lodash';
import { std } from "../modules/library";

export function hostLibrary(fns: HostFunction[]): ModuleLibrary {
    return {
        //TODO this doesn't handle matching Modules, it only matches HostFunctions
        call: (fieldPath: FieldPath, args: WanderValue[]) => {
            for (const hostFunction of fns) {
                if (_.isEqual(hostFunction.fieldPath, fieldPath)) {
                    const res = hostFunction.fn(args, std());
                    if (res.isLeft()) {
                        return res;
                    } else {
                        return Right(Just(res.unsafeCoerce()));
                    }
                }
            }
            return Right(Nothing)
        }
    }
}
