import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class Term extends Word{

    private readonly termId: number

    /**
     * Constructor for the Term class. Sets the fields.
     * @param name Text of the term
     * @param termId Id of the term
     */
    constructor(name: string, termId: number) {
        super(name)
        this.termId = termId
    }

    /**
     * Accessor for the term id attribute.
     * @return Term id attribute
     */
    getTermId(): number{
        return this.termId
    }
}