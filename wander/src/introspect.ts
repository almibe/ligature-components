import { WanderValue } from "./values";

export function introspect(script: string): WanderValue {
    const value = new Map<string, WanderValue>();
    value.set("script", {type: "String", value: script});
    value.set("tokens", {type: "Array", value: []});
    value.set("expressions", {type: "Array", value: []});
    return {type: "Module", value};
}
