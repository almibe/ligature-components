type rec call = { "type": string, "commandName" : string, "arguments" : array<wanderValue>}

and assignment =
  { "type" : string
  , "variable" : Ligature.variable
  , "value" : wanderValue
  }

and statement = 
  | Call 
  | Assignment

and script = array<statement>

and wanderValue = 
  | Element(Ligature.element) 
  | Pipe 
  | Comma
  | Variable(Ligature.variable) 
  | Network(Ligature.network) 
  | Literal(Ligature.literal) 
  | Quote(quote)

and quote = array<wanderValue>

type command = (unit) => unit //--(local: Map<Element, Command>, modules: Map<Element, Map<Element, Command>>, variables: Map<Variable, Element | Literal>, args: WanderValue[]) => WanderValue
