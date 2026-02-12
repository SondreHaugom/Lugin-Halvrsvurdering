import hljs from "highlight.js"
import markdownit from "markdown-it"
import "highlight.js/styles/a11y-light.min.css"
import "katex/dist/katex.min.css"
import markdownKatex from "@vscode/markdown-it-katex"


export const md = markdownit({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return wrapInPreCode(hljs.highlight(str, { language: lang, ignoreIllegals: true }).value)
            } catch (err) {
                console.error("Error highlighting code:", err) 

            }
        }
        return wrapInPreCode(md.utils.escapeHtml(str))
    }
})


