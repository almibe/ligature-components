import {createContext} from '@lit/context';
import { WanderResult } from '@wander-lang/wander/src/values';
import { makeAutoObservable } from 'mobx'
import { Applet, rawTextApplet } from './applets';
import { run } from '@wander-lang/wander/src/interpreter';
import { std } from '@wander-lang/wander/src/host/library';

export class ShellStore {
    results: Result[] = [];
    applets: Applet[] = [];
    script: string = "";

    constructor() {
        makeAutoObservable(this);
    }

    id = 0;

    addResult(script: string, result: WanderResult) {
        const id = this.id++;
        let finalResult: Result = {
            id,
            script: script,
            wanderResult: result,
            applet: rawTextApplet,
            content: rawTextApplet.render(result)
        };
        this.results.unshift(finalResult);
    }

    removeResult(index: number) {
        this.results.remove(this.results[index]);
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
        this.applets.push(applet);
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
    applet: Applet
    content: Element
}

export const shellStoreContext = createContext<ShellStore>('shell-store');
