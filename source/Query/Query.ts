import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class Query {

    private readonly terms: Array<Word> = new Array<Word>()
    private shortcuts: Array<string> = ["cc", "cm2", "cm", "gb", "ghz", "gr", "gram", "hz", "inc", "inch", "inç",
        "kg", "kw", "kva", "litre", "lt", "m2", "m3", "mah", "mb", "metre", "mg", "mhz", "ml", "mm", "mp", "ms",
        "mt", "mv", "tb", "tl", "va", "volt", "watt", "ah", "hp", "oz", "rpm", "dpi", "ppm", "ohm", "kwh", "kcal",
        "kbit", "mbit", "gbit", "bit", "byte", "mbps", "gbps", "cm3", "mm2", "mm3", "khz", "ft", "db", "sn", "g", "v", "m", "l", "w", "s"]

    /**
     * Another constructor of the Query class. Splits the query into multiple words and put them into the terms array.
     * @param query Query string
     */
    constructor(query: string = undefined) {
        if (query != undefined){
            let terms = query.split(" ")
            for (let term of terms){
                this.terms.push(new Word(term))
            }
        }
    }

    /**
     * Accessor for the terms array. Returns the term at position index.
     * @param index Position of the term in the terms array.
     * @return The term at position index.
     */
    getTerm(index: number): Word{
        return this.terms[index]
    }

    /**
     * Returns the size of the query, i.e. number of words in the query.
     * @return Size of the query, i.e. number of words in the query.
     */
    size(): number{
        return this.terms.length
    }

    /**
     * Filters the original query by removing phrase attributes, shortcuts and single word attributes.
     * @param attributeList Hash set containing all attributes (phrase and single word)
     * @param termAttributes New query that will accumulate single word attributes from the original query.
     * @param phraseAttributes New query that will accumulate phrase attributes from the original query.
     * @return Filtered query after removing single word and phrase attributes from the original query.
     */
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