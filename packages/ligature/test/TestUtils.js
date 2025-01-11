import { globSync } from "glob"
import fs from 'node:fs';

export function readTests() {
    let path = (process.env.LIGATURE_TEST_SUITE).replaceAll("\\", "/")
    let files = globSync(path + "/**/core-no-imports.wander")
    return files.map(fileName => {
        let text = fs.readFileSync(fileName, 'utf8')
        return [fileName, text]
    })
}
