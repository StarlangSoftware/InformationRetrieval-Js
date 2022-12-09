import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class Query {

    private readonly terms: Array<Word> = new Array<Word>()

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

    filterAttributes(attributeList: Set<string>, termAttributes: Query, phraseAttributes: Query){
        let i = 0
        while (i < this.terms.length){
            if (i < this.terms.length - 1){
                let pair = this.terms[i].getName() + " " + this.terms[i + 1].getName()
                if (attributeList.has(pair)){
                    phraseAttributes.terms.push(new Word(pair))
                    i += 2
                    continue
                }
            }
            if (attributeList.has(this.terms[i].getName())){
                termAttributes.terms.push(this.terms[i])
            }
            i++
        }
    }
}