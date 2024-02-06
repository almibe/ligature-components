import "xterm/css/xterm.css";
import { Terminal } from 'xterm';
import { Readline } from "xterm-readline";
import { printResult, run } from "@wander-lang/wander/src/interpreter";
import { parse } from "@wander-lang/wander/src/parser";

BigInt.prototype.toJSON = function() { return this.toString() }

const term = new Terminal({
  theme: {
        background: "#191A19",
        foreground: "#F5F2E7",
  },
  cursorBlink: true,
  cursorStyle: "block"
});

const rl = new Readline();

term.loadAddon(rl);
term.open(document.getElementById('terminal'));
term.focus();

rl.setCheckHandler((text) => {
  let trimmedText = text.trimEnd();
  if (trimmedText.endsWith("\\")) {
    return false;
  }
  return true;
});

function readLine() {
  rl.read("> ")
    .then(process);
}

function process(input: string) {
  const arrayOfLines = input.match(/[^\r\n]+/g);
  let script = "";
  if (arrayOfLines != null) {
    for (const line of arrayOfLines) {
      if (line.endsWith("\\")) {
        script += line.slice(0, -1) + "\n"
      } else {
        script += line + "\n"
      }
    }  
  }
  script = script.trim();
  if (script.startsWith("!")) {
    script = script.slice(1);
    rl.println(JSON.stringify(parse(script), null, 2));
  } else {
    const result = printResult(run(script));
    rl.println(result);  
  }
  setTimeout(readLine);
}

readLine();