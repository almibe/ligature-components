import {createContext} from '@lit/context';
import { WanderResult } from '@wander-lang/wander/src/values';
import { Applet, rawTextApplet } from './applets';
import { signal, Signal } from "@preact/signals";

export class ShellState {
    private results: Signal<Result[]> = signal([]);
    private applets: Signal<Applet[]> = signal([]);
    private script: Signal<string> = signal("");
    private id = 0;

    constructor() {
    }

    addResult(script: string, result: WanderResult) {
        const id = this.id++;
        let finalResult: Result = {
            id,
            script: script,
            wanderResult: result,
            applet: rawTextApplet,
        };
        this.results.unshift(finalResult);
    }

    removeResult(id: number) {
        this.results.replace(this.results.filter(result => result.id !== id));
    }

    clearEditor() {
        this.script = ""
    }

    setScript(script: string) {
        this.script = script
    }

    runEditor() {
        let script = this.script;
        let result = run(script, std());
        if (result.isRight()) {
            this.clearEditor()
        }
        this.addResult(script, result);
    }

    runScript(script: string) {
        let result = run(script, std());
        this.addResult(script, result);
    }

    addApplet(applet: Applet) {
      //  this.applets.push(applet);
    }

    removeApplet(applet: Applet) {
        const idx = this.applets.findIndex((a) => (a == applet))
        if (idx > -1) {
            this.applets.splice(idx, 1);
        }
    }
}

export interface Result {
    readonly id: number
    readonly script: string
    readonly wanderResult: WanderResult
    readonly applet: Applet
}

export const shellStoreContext = createContext<ShellState>('shell-store');
