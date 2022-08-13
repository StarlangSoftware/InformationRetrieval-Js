import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class Query {

    private readonly terms: Array<Word> = new Array<Word>()

    constructor(query: string) {
        let terms = query.split(" ")
        for (let term of terms){
            this.terms.push(new Word(term))
        }
    }

    getTerm(index: number): Word{
        return this.terms[index]
    }

    size(): number{
        return this.terms.length
    }
}