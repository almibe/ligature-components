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

    id = 0n;

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
        setStore(produce((store) => {
            store.results = store.results.filter(r => r.id != result.id);
        }))
        this.results = this.results.splice(index, 1);
    }

    clearEditor() {
        this.script = ""
    }

    setScript(script: string) {
        console.log("in setScript " + script)
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
    readonly id: bigint
    readonly script: string
    readonly wanderResult: WanderResult
    readonly applet: Applet
    readonly content: Element
}

export const shellStoreContext = createContext<ShellStore>('shell-store');
