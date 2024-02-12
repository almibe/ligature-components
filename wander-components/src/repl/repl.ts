import "xterm/css/xterm.css";
import { Terminal } from 'xterm';
import { Readline } from "xterm-readline";
import { FitAddon } from '@xterm/addon-fit';

BigInt.prototype.toJSON = function() { return this.toString() }

export function initializeRepl(elementId: string, onRun: any) {
  const term = new Terminal({
    theme: {
          background: "#191A19",
          foreground: "#F5F2E7",
    },
    cursorBlink: true,
    cursorStyle: "block"
  });

  const fitAddon = new FitAddon();
  const rl = new Readline();
  
  term.loadAddon(rl);
  term.loadAddon(fitAddon);
  term.open(document.getElementById(elementId));
  term.focus();
  fitAddon.fit();
  
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
  
  async function process(input: string) {
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
    const result = await onRun(script); //printResult(run(script));
    rl.println(result);  
    setTimeout(readLine);
  }
  
  readLine();  
}
