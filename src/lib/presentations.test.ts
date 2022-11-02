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
    expect(presentation.tableData).toEqual(tableExpected);
    expect(presentation.graphData).toEqual(elementsExpected);
});

test('Read multiple Statements about a single Entity', () => {
    let input = "<a> <b> <c>\n<a> <d> <e>";

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
    expect(presentation.tableData).toEqual(tableExpected);
    expect(presentation.graphData).toEqual(elementsExpected);
});

test('Read multiple Statements about a single Entity with a Single Attribute', () => {
    let input = "<a> <b> <c>\n<a> <b> <d>";

    let tableExpected = {
        data: [
            { id: 1, "<entity>": "a", "b": ["<c>", "<d>"]}
        ],
        columns: [
            {title:"Entity", field:"<entity>", sorter:"string"},
            {title:"b", field:"b", sorter:"string"}
        ]
    };

    let elementsExpected = [
        {data: {id: "<a>"}},
        {data: {id: "<c>"}},
        {data: {label: "b", source: "<a>", target: "<c>"}},
        {data: {id: "<a>"}},
        {data: {id: "<d>"}},
        {data: {label: "b", source: "<a>", target: "<d>"}}        
    ];

    let presentation = wanderResultToPresentation(input);
    expect(presentation.tableData).toEqual(tableExpected);
    expect(presentation.graphData).toEqual(elementsExpected);
});

// test('Support Strings', () => {
//     let input = "<a> <b> \"c\"";
    
//     let tableExpected = {
//         data: [
//             {"id": 1, "<entity>": "a", "b": "c"},
//         ],
//         columns: [
//             {title:"Entity", field:"<entity>", sorter:"string"},
//             {title:"b", field:"b", sorter: "string"}
//         ]
//     };

//     let elementsExpected = [
//         {data: {id: "<a>"}},
//         {data: {id: 0, label: "c"}},
//         {data: {label: "b", source: "<a>", target: 0}}
//     ]

//     let presentation = wanderResultToPresentation(input);
//     console.log(presentation);
//     expect(presentation.tableView()).toEqual(tableExpected);
//     expect(presentation.graphElements()).toEqual(elementsExpected);
// });
