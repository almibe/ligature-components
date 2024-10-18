import './style.css'
import { run } from "@ligature/ligature"
import { showTable } from "./table/table"

showTable(
  "#table", 
  run("test {a b c} (read test)"))
