import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";

export class TermOccurrence {

    private readonly term: Word
    private readonly docId: number
    private readonly position: number

    /**
     * Constructor for the TermOccurrence class. Sets the attributes.
     * @param term Term for this occurrence.
     * @param docId Document id of the term occurrence.
     * @param position Position of the term in the document for this occurrence.
     */
    constructor(term: Word, docId: number, position: number) {
        this.term = term
        this.docId = docId
        this.position = position
    }

    /**
     * Accessor for the term.
     * @return Term
     */
    getTerm(): Word{
        return this.term
    }

    /**
     * Accessor for the document id.
     * @return Document id.
     */
    getDocId(): number{
        return this.docId
    }

    /**
     * Accessor for the position of the term.
     * @return Position of the term.
     */
    getPosition(): number{
        return this.position
    }

    static wordComparator = (comparator: WordComparator) =>
        (word1: Word, word2: Word) => (comparator == WordComparator.TURKISH ?
                word1.getName().localeCompare(word2.getName(), "tr") :
                (comparator == WordComparator.TURKISH_IGNORE_CASE ? word1.getName().toLocaleLowerCase("tr").localeCompare(word2.getName().toLocaleLowerCase("tr"), "tr") :
                    word1.getName().localeCompare(word2.getName(), "en"))
        )

    /**
     * Checks if the current occurrence is different from the other occurrence.
     * @param currentTerm Term occurrence to be compared.
     * @param comparator Comparator function to compare two terms.
     * @return True, if two terms are different; false if they are the same.
     */
    isDifferent(currentTerm: TermOccurrence, comparator: WordComparator): boolean{
        return TermOccurrence.wordComparator(comparator)(this.term, currentTerm.getTerm()) != 0
    }
}