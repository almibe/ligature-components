import {createContext} from '@lit/context';
import { WanderResult } from '@wander-lang/wander/src/values';
import { makeAutoObservable } from 'mobx'
import { Applet } from './applets';
import { run } from '@wander-lang/wander/src/interpreter';
import { std } from '@wander-lang/wander/src/host/library';

export class ShellStore {
    results: Result[] = [];
    applets: Applet[] = [];
    script: string = "";

    constructor() {
        makeAutoObservable(this);
    }

    addResult(script: string, result: WanderResult) {
        this.results.push({script, result});
    }

    removeResult(index: number) {
        this.results = this.results.splice(index, 1);
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
    script: string,
    result: WanderResult
}

export const shellStoreContext = createContext<ShellStore>('shell-store');
