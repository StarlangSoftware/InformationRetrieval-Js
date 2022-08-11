import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";

export class TermOccurrence {

    private readonly term: Word
    private readonly docId: number
    private readonly position: number

    constructor(term: Word, docId: number, position: number) {
        this.term = term
        this.docId = docId
        this.position = position
    }

    getTerm(): Word{
        return this.term
    }

    getDocId(): number{
        return this.docId
    }

    getPosition(): number{
        return this.position
    }

    wordComparator = (comparator: WordComparator) =>
        (word1: Word, word2: Word) => (comparator == WordComparator.TURKISH ?
                word1.getName().localeCompare(word2.getName(), "tr") :
                (comparator == WordComparator.TURKISH_IGNORE_CASE ? word1.getName().toLocaleLowerCase("tr").localeCompare(word2.getName().toLocaleLowerCase("tr"), "tr") :
                    word1.getName().localeCompare(word2.getName(), "en"))
        )

    isDifferent(currentTerm: TermOccurrence, comparator: WordComparator): boolean{
        return this.wordComparator(comparator)(this.term, currentTerm.getTerm()) != 0
    }
}