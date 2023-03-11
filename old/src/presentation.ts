export type error = {
    error: string
}

export type Identifier = {
    identifier: string
}

export type Value = string | Identifier

export type State = {
    input: string,
    location: number
}

export type Statement = [Identifier, Identifier, Value]

type Node = string
type Edge = [Node, Node, {label: string}]

type Data = { id: number }
type Column = { title: string, field: string, sorter: string }

type TableData = { columns: Array<Column>, data: Array<Data> };
type GraphData = {nodes: Array<Node>, edges: Array<Edge>};
type Presentation = { tableData: TableData, graphData: GraphData };

export class StatementsPresentation {
    private store: Array<Statement> = [];

    public addStatement(statement: Statement): void {
        if (!this.store.find((s) => (statement[0] == s[0] && statement[1] == s[1] && statement[2] == s[2]))) {
            this.store.push(statement);
        }
    }

    public presentation(): Presentation {
        return { tableData: this.tableView(), graphData: this.graphElements()};
    }

    public tableView(): TableData {
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
                    if (typeof match[columnName] == 'array') {
                        match[columnName].push(this.writeValue(statement[2]));
                    } else {
                        let oldValue = match[columnName];
                        match[columnName] = [oldValue, this.writeValue(statement[2])];
                    }
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

    public graphElements(): GraphData {
        let nodes: Set<Node> = new Set()
        let edges: Array<Edge> = []

        this.store.forEach((statement) => {
            let entity = this.writeValue(statement[0])
            let value = this.writeValue(statement[2])
            nodes.add(entity);
            nodes.add(value);
            edges.push([entity, value, {label: statement[1].identifier}])
            // result.push({data: {id: entity}})
            // result.push({data: {id: value}})
            // result.push({data: {label: statement[1].identifier, source: entity, target: value}})
        })
        return {nodes: Array.from(nodes), edges};
    }

    private writeValue(value: Value): string {
        if (typeof value == 'object' && 'identifier' in value) {
            return "<" + value.identifier + ">";
        } else {
            return value;
        }
    }
}

function checkValue(input: string): Presentation | null {
    let state = { input: input.trim(), location: 0 };
    let value = readValue(state)
    if (state.location != state.input.length) {
        return null;
    }
    if (typeof value == 'string') {
        return {
            tableData: { columns: [{title: "Value", field: "value", sorter: "string"}], data: [{id: 1, value}]},
            graphData: [{ data: { id: value } }]
        }
    } else if ('identifier' in value) {
        let valueString = "<" + value.identifier + ">";
        return {
            tableData: { columns: [{title: "Value", field: "value", sorter: "string"}], data: [{id: 1, value: valueString}]},
            graphData: [{ data: { id: valueString } }]
        }
    } else {
        return null;
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
    let valuePresentation = checkValue(input)
    if (valuePresentation != null) {
        return valuePresentation;
    }

    let state = { input, location: 0 };
    let result = new StatementsPresentation();

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
    return result.presentation();
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
            if (/[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;%=]/.test(state.input[state.location])) {
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

function readInteger(state: State): string | error {
    let integer = "";
    while(state.location < state.input.length) {
        if (/[0-9-]/.test(state.input[state.location])) {
            integer = integer + state.input[state.location];
            state.location++;
        } else {
            if (integer.length > 0) {
                return integer;
            } else {
                return {error: "Invalid Integer"};
            }
        }
    }
    if (integer.length > 0) {
        return integer;
    } else {
        return {error: "Invalid Integer"};
    }
}

function readString(state: State): string | error {
    let result = "";
    if (state.input[state.location] == '"') {
        state.location++;
    } else {
        return {error: "Invalid String"};
    }
    while(state.location < state.input.length) {
        if (state.input[state.location] != '"') {
            result = result + state.input[state.location];
            state.location++;
        } else {
            state.location++; //skip "
            if (result.length > 0) {
                return '"' + result + '"';
            } else {
                return {error: "Invalid String"};
            }
        }
    }
    return {error: "Invalid String"};
}

function readValue(state: State): string | { identifier: string } | error {
    let nextChar = state.input[state.location];
    if (/[0-9-]/.test(nextChar)) { //TODO not complete
        return readInteger(state);
    } else if (nextChar == '"') {
        return readString(state);
    } else {
        return readIdentifier(state);
    }
}
