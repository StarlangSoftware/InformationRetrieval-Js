import { Word } from "nlptoolkit-dictionary/dist/Dictionary/Word";
export declare class Term extends Word {
    private readonly termId;
    /**
     * Constructor for the Term class. Sets the fields.
     * @param name Text of the term
     * @param termId Id of the term
     */
    constructor(name: string, termId: number);
    /**
     * Accessor for the term id attribute.
     * @return Term id attribute
     */
    getTermId(): number;
}
