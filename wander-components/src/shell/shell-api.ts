import { createContext } from "@lit/context";
import { WanderResult } from "@wander-lang/wander/src/values";

export interface ShellApi {
  addResult(script: string, result: WanderResult): void
  removeResult(index: number): void
  clearEditor(): void
  setEditor(script: string): void
}

export function createShellApi(): ShellApi {
    return {
        addResult: (script, result) => {throw "Not supported.";},
        removeResult: (index) => {throw "Not supported.";},
        clearEditor: () => (throw "Not supported.";),
        setEditor: (script) => (throw "Not supported.";)
    }
}

export const shellApiContext = createContext<ShellApi>('shell-api');
