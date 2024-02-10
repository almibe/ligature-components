import { ModuleValue, WanderResult, WanderValue } from "@wander-lang/wander/src/values"
import { printResult, printValue } from "@wander-lang/wander/src/interpreter"
import { introspect } from "@wander-lang/wander/src/introspect"
import { html } from "lit"

export interface Applet {
    readonly name: string
    predicate(value: WanderResult, script: string): boolean
    render(value: WanderResult, script: string): Element
}

export const errorApplet: Applet = {
    name: "Error",
    predicate: (value: WanderResult) => {
         if (value.isRight()) {
            let wanderValue = value.unsafeCoerce()[0]
            if (wanderValue.type == "Module") {
                return wanderValue.value.has("error")
            }
         }
        return value.isLeft()
    },
    render: (value: WanderResult) => {
        return escape(printResult(value))
    }
}

export const textApplet: Applet = {
    name: "Text",
    predicate: (value: WanderResult) => {
        if (value.isRight()) {
            let wanderValue = value.unsafeCoerce()[0];
            if (wanderValue.type == "Module") {
                return wanderValue.value.has("result");
            }
        }
        return false;
    },
    render: (value: WanderResult) => {
        let module: ModuleValue = value.unsafeCoerce()[0];
        let result = printValue(module.value.get("result"));
        return escape(result);
    }
}

export const htmlApplet: Applet = {
    name: "Html",
    predicate: (value: WanderResult) => {
        if (value.isRight()) {
            const wanderValue = value.unsafeCoerce()[0];
            if (wanderValue.type == "Module") {
                const result: WanderValue = wanderValue.value.get("result");
                if (result != undefined && result.type == "Module") {
                    return result.value.has("html");
                }
            }
        }
        return false;
    },
    render: (value: WanderResult) => {
        let module: ModuleValue = value.unsafeCoerce()[0];
        let result = module.value.get("result");
        let html = result.value.get("html").value
        return html;
    }
}

export const rawTextApplet: Applet = {
    name: "Raw Text",
    predicate: (value) => true,
    render: (value: WanderResult) => {
        return escape(printResult(value))
    }
}

export const introspectionApplet: Applet = {
    name: "Introspect",
    predicate: (value) => true,
    render: (value: WanderResult, script: string) => {
        const intro = introspect(script);

        return html`
            <div>
                Introspection
                <hr>
                Expressions: 
            </div>
        `
    }
};

//from lodash https://github.com/lodash/lodash/blob/9d11b48ce5758df247607dc837a98cbfe449784a/escape.js
const htmlEscapes = {
    '&': '&amp',
    '<': '&lt',
    '>': '&gt',
    '"': '&quot',
    "'": '&#39'
  }
  
  /** Used to match HTML entities and HTML characters. */
  const reUnescapedHtml = /[&<>"']/g
  const reHasUnescapedHtml = RegExp(reUnescapedHtml.source)
function escape(string: string): string {
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, (chr) => htmlEscapes[chr])
      : string
  }