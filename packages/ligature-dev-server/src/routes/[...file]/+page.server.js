import fs from 'node:fs/promises';

export async function load({url}) {
    let scriptFile = process.env.LIGATURE_HOME + "/http" + url.pathname

    let script = await fs.readFile(scriptFile, {encoding: "utf-8"});

    

    return { script : script }
}