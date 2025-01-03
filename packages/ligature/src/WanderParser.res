@module("../WanderTokenizer.js") external reset: string => unit = "reset"

type token = {
  "type": string,
  "value": string,
}

@module("../WanderTokenizer.js") external next: unit => token = "next" //TODO add token type

