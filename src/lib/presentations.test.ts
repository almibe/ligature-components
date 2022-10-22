import { Value, readIdentifier, wanderResultToPresentation, resultToTableData, type Identifier } from './presentation';

test('Read Identifier', () => {
    let input = "<a>";
    let expected = {identifier: "a"};
    expect(readIdentifier({input, location:0})).toEqual(expected);
});

test('Read basic Statement', () => {
    let input = "<a> <b> <c>";
    
    let tableExpected = {
        data: [
            {"id": 1, "<entity>": "a", "b": "<c>"},
        ],
        columns: [
            {title:"Entity", field:"<entity>", sorter:"string"},
            {title:"b", field:"b", sorter: "string"}
        ]
    };

    let elementsExpected = [
        {data: {id: "<a>"}},
        {data: {id: "<c>"}},
        {data: {label: "b", source: "<a>", target: "<c>"}}
    ]

    let presentation = wanderResultToPresentation(input);
    expect(presentation.tableView()).toEqual(tableExpected);
    expect(presentation.graphElements()).toEqual(elementsExpected);
});

test('Read multiple Statements aobut a single Entity', () => {
    let input = "<a> <b> <c>\n<a> <d> <e>"; //TODO add test with a duplicate attribute

    let tableExpected = {
        data: [
            { id: 1, "<entity>": "a", "b": "<c>", "d": "<e>"}
        ],
        columns: [
            {title:"Entity", field:"<entity>", sorter:"string"},
            {title:"b", field:"b", sorter:"string"},
            {title:"d", field:"d", sorter:"string"}
        ]
    };

    let elementsExpected = [
        {data: {id: "<a>"}},
        {data: {id: "<c>"}},
        {data: {label: "b", source: "<a>", target: "<c>"}},
        {data: {id: "<a>"}},
        {data: {id: "<e>"}},
        {data: {label: "d", source: "<a>", target: "<e>"}}        
    ];

    let presentation = wanderResultToPresentation(input);
    expect(presentation.tableView()).toEqual(tableExpected);
    expect(presentation.graphElements()).toEqual(elementsExpected);
});
