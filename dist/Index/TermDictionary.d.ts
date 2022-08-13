import { Dictionary } from "nlptoolkit-dictionary/dist/Dictionary/Dictionary";
import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import { TermOccurrence } from "./TermOccurrence";
export declare class TermDictionary extends Dictionary {
    constructor(comparator: WordComparator, fileNameOrTerms?: any);
    addTerm(name: string, termId: number): void;
    save(fileName: string): void;
    static constructNGrams(word: string, termId: number, k: number): Array<TermOccurrence>;
    termComparator: (comparator: WordComparator) => (termA: TermOccurrence, termB: TermOccurrence) => number;
    constructTermsFromDictionary(k: number): Array<TermOccurrence>;
}
