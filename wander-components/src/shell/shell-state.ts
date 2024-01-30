import {createContext} from '@lit/context';
import {signal, Signal} from '@lit-labs/preact-signals';
import { WanderResult } from '@wander-lang/wander/src/values';

export interface Result {
    script: string,
    result: WanderResult
}

export interface ShellState {
    readonly results: Signal<Result[]>
    readonly script: Signal<string>
}

export function createShellState(): ShellState {
    return {
        results: signal([]),
        script: signal(""),
    }
}

export const shellStateContext = createContext<ShellState>('shell-state');
