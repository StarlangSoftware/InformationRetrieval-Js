import { Word } from "nlptoolkit-dictionary/dist/Dictionary/Word";
import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
export declare class TermOccurrence {
    private readonly term;
    private readonly docId;
    private readonly position;
    /**
     * Constructor for the TermOccurrence class. Sets the attributes.
     * @param term Term for this occurrence.
     * @param docId Document id of the term occurrence.
     * @param position Position of the term in the document for this occurrence.
     */
    constructor(term: Word, docId: number, position: number);
    /**
     * Accessor for the term.
     * @return Term
     */
    getTerm(): Word;
    /**
     * Accessor for the document id.
     * @return Document id.
     */
    getDocId(): number;
    /**
     * Accessor for the position of the term.
     * @return Position of the term.
     */
    getPosition(): number;
    static wordComparator: (comparator: WordComparator) => (word1: Word, word2: Word) => number;
    /**
     * Checks if the current occurrence is different from the other occurrence.
     * @param currentTerm Term occurrence to be compared.
     * @param comparator Comparator function to compare two terms.
     * @return True, if two terms are different; false if they are the same.
     */
    isDifferent(currentTerm: TermOccurrence, comparator: WordComparator): boolean;
}
