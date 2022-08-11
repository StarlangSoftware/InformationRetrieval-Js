import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class Term extends Word{

    private readonly termId: number

    constructor(name: string, termId: number) {
        super(name)
        this.termId = termId
    }

    getTermId(): number{
        return this.termId
    }
}