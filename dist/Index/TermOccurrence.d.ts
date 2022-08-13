import { Word } from "nlptoolkit-dictionary/dist/Dictionary/Word";
import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
export declare class TermOccurrence {
    private readonly term;
    private readonly docId;
    private readonly position;
    constructor(term: Word, docId: number, position: number);
    getTerm(): Word;
    getDocId(): number;
    getPosition(): number;
    wordComparator: (comparator: WordComparator) => (word1: Word, word2: Word) => number;
    isDifferent(currentTerm: TermOccurrence, comparator: WordComparator): boolean;
}
