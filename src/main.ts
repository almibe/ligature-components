import './style.css'
import { run } from "@ligature/ligature"
import { showTable } from "./table/table"
import { showText } from './text/text'
import { showGraph } from './graph/graph'

const entries = run("test {a b c} (read test)")

showTable(
  "#table", 
  entries
)

showText(
  "#text",
  entries
)

showGraph(
  "#graph",
  entries
)
