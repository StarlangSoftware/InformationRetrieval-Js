import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class Query {

    private readonly terms: Array<Word> = new Array<Word>()
    private shortcuts: Array<string> = ["cc", "cm2", "cm", "gb", "ghz", "gr", "gram", "hz", "inc", "inch", "inç",
        "kg", "kw", "kva", "litre", "lt", "m2", "m3", "mah", "mb", "metre", "mg", "mhz", "ml", "mm", "mp", "ms",
        "mt", "mv", "tb", "tl", "va", "volt", "watt", "ah", "hp", "oz", "rpm", "dpi", "ppm", "ohm", "kwh", "kcal",
        "kbit", "mbit", "gbit", "bit", "byte", "mbps", "gbps", "cm3", "mm2", "mm3", "khz", "ft", "db", "sn", "g", "v", "m", "l", "w", "s"]

    constructor(query: string = undefined) {
        if (query != undefined){
            let terms = query.split(" ")
            for (let term of terms){
                this.terms.push(new Word(term))
            }
        }
    }

    getTerm(index: number): Word{
        return this.terms[index]
    }

    size(): number{
        return this.terms.length
    }

    filterAttributes(attributeList: Set<string>, termAttributes: Query, phraseAttributes: Query): Query{
        let i = 0
        let filteredQuery = new Query()
        while (i < this.terms.length){
            if (i < this.terms.length - 1){
                let pair = this.terms[i].getName() + " " + this.terms[i + 1].getName()
                if (attributeList.has(pair)){
                    phraseAttributes.terms.push(new Word(pair))
                    i += 2
                    continue
                }
                if (this.shortcuts.includes(this.terms[i + 1].getName())){
                    if (this.terms[i].getName().match("^[+-]?\\d+$|^[+-]?(\\d+)?\\.\\d*$")){
                        phraseAttributes.terms.push(new Word(pair))
                        i += 2
                        continue
                    }
                }
            }
            if (attributeList.has(this.terms[i].getName())){
                termAttributes.terms.push(this.terms[i])
            } else {
                filteredQuery.terms.push(this.terms[i])
            }
            i++
        }
        return filteredQuery
    }
}