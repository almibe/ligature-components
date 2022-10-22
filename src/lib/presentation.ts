export type error = {
    error: string
}

export type Identifier = {
    identifier: string
}

export type Value = string | bigint | Identifier

export type State = {
    input: string,
    location: number
}

export type Statement = [Identifier, Identifier, Value]

type GElement = GNode | GEdge
type GNode = { data: { id: string } }
type GEdge = { data: { label: string, source: string, target: string}}

type Data = { id: number }
type Column = { title: string, field: string, sorter: string }

export class Presentation {
    private store: Array<Statement> = []; //TODO make private

    public addStatement(statement: Statement): void {
        if (!this.store.find((s) => (statement[0] == s[0] && statement[1] == s[1] && statement[2] == s[2]))) {
            this.store.push(statement);
        }
    }

    public tableView(): { columns: Array<Column>, data: Array<Data> } {
        let columns: Array<Column> = [{title:"Entity", field:"<entity>", sorter:"string"}];
        let data: Array<Data> = [];
        let index = 0; //index used for tabulator

        this.store.forEach((statement: Statement) => {
            let columnName = statement[1].identifier;
            if (!columns.find((column) => column.title == columnName)) {
                columns.push({title: columnName, field: columnName, sorter:"string"});
            }

            let entity = statement[0].identifier;
            let match = data.find((d) => d["<entity>"] == entity)
            if (match) {
                if (columnName in match) {//  if so check if column exists
                    //if so make column a list (or add to list if it already exists)
                    //or maybe throw an error if showing a list is weird
                } else {
                    match[columnName] = this.writeValue(statement[2]); //this is wrong
                }
            } else {
                index++;
                let newRow = {id: index, "<entity>": entity};
                newRow[columnName] = this.writeValue(statement[2]); //this is wrong
                data.push(newRow);
            }
        });

        return {
            columns, 
            data
        };
    }

    public graphElements(): Array<GElement> {
        let result: Array<GElement> = []
        this.store.forEach((statement) => {
            let entity = this.writeValue(statement[0])
            let value = this.writeValue(statement[2])
            result.push({data: {id: entity}})
            result.push({data: {id: value}})
            result.push({data: {label: statement[1].identifier, source: entity, target: value}})
        })
        return result;
    }

    private writeValue(value: Value): any {
        if (typeof value == 'object' && 'identifier' in value) {
            return "<" + value.identifier + ">";
        } else {
            return value;
        }
    }
}

/**
 * @param input - the result of the Wander query 
 * @returns - an object that can be used as a datasource for the table or graph display
 * 
 * Examples:
 *  Scalars (just return the Scalar):
 *   input:  5
 *   output: 5
 * 
 *  Graph:
 *   input:
 *    <a> <b> <c>
 *    <a> <bb> <cc>
 *    <b> <e> <f>
 *   output:
 *    {
 *      columns: [
 *        {title:"Entity", field:"<entity>", sorter:"string"},  //use <entity> as a field name so it's unique
 *        {title:"b", field:"b", sorter:"string"},
 *        {title:"bb", field:"bb", sorter:"string"},
 *        {title:"e", field:"e", sorter:"string"}, 
 *      ],
 *      data: [
 *        {"id": 1, "<entity>": "<a>", "b": "<c>", "bb": "<cc>", "e" null},
 *        {"id": 2, "<entity>": "<b>", "b": null, "bb": null, "e": "<f>"}
 *      ]
 *    }
 */
export function wanderResultToPresentation(input: string): Presentation | error {
    let state = { input, location: 0 };
    let result = new Presentation();

    while (state.location < state.input.length) {
        ignoreSpace(state);
        let entityRes = readIdentifier(state);
        if (typeof entityRes == 'object' && 'error' in entityRes) {
            return entityRes;
        }
        ignoreSpace(state);
        let attributeRes = readIdentifier(state);
        if (typeof attributeRes == 'object' && 'error' in attributeRes) {
            return attributeRes;
        }
        ignoreSpace(state);
        let valueRes = readValue(state);
        if (typeof valueRes == 'object' && 'error' in valueRes) {
            return valueRes;
        }
        ignoreSpaceAndNewLine(state);

        result.addStatement([entityRes, attributeRes, valueRes]);
    }
    return result
}

function ignoreSpace(state: State) {
    while (state.location < state.input.length) {
        let char = state.input[state.location];
        if (char === " ") {
            state.location++;
        } else {
            return
        }
    }
}

function ignoreSpaceAndNewLine(state: State) {
    while (state.location < state.input.length) {
        let char = state.input[state.location];
        if (char === " " || char == "\r" || char == "\n") {
            state.location++;
        } else {
            return
        }
    }
}

export function readIdentifier(state: State): Identifier | error {
    let identifier = "";
    if (state.input[state.location] == "<") {
        state.location++; //skip <
        while(state.location < state.input.length) {
            if (/[a-zA-Z_]/.test(state.input[state.location])) { //TODO this partern isn't complete
                identifier = identifier + state.input[state.location];
                state.location++;
            } else if (state.input[state.location] == ">") {
                if (identifier.length == 0) {
                    return {error: "Identifier can't be empty."};
                } else {
                    state.location++; //skip >
                    return {identifier};
                }
            } else {
                return {error: "Invalid identifier character " + state.input[state.location]}
            }
        }
    }
    return {error: "Invalid Identifier"}
}

function readValue(state: State): bigint | string | { identifier: string } | error {
    return readIdentifier(state);
}
