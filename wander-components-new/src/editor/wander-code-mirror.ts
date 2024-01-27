import {parser} from "@wander-lang/wander/src/wander-lezer-parser.js";
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {styleTags, tags} from "@lezer/highlight"

export const WanderLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({closing: ")", align: false})
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        FieldName: tags.variableName,
        Bool: tags.bool,
        String: tags.string,
        Int: tags.number,
        LineComment: tags.lineComment,
        "( )": tags.paren
      })
    ]
  }),
  languageData: {
    commentTokens: {line: ";"}
  }
})

export function WanderLanguageSupport() {
  return new LanguageSupport(WanderLanguage)
}
