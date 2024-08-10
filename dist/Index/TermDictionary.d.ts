import { Dictionary } from "nlptoolkit-dictionary/dist/Dictionary/Dictionary";
import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import { TermOccurrence } from "./TermOccurrence";
export declare class TermDictionary extends Dictionary {
    /**
     * Constructor of the TermDictionary. Reads the terms and their ids from the given dictionary file. Each line stores
     * the term id and the term name separated via space.
     * @param fileName Dictionary file name
     */
    constructor1(fileName: string): void;
    /**
     * Constructs the TermDictionary from a list of tokens (term occurrences). The terms array should be sorted
     * before calling this method. Constructs the distinct terms and their corresponding term ids.
     * @param comparator Comparator method to compare two terms.
     * @param terms Sorted list of tokens in the memory collection.
     */
    constructor2(comparator: WordComparator, terms: Array<TermOccurrence>): void;
    /**
     * Constructs the TermDictionary from a hash set of tokens (strings). Constructs sorted dictinct terms array and
     * their corresponding term ids.
     * @param comparator Comparator method to compare two terms.
     * @param terms Hash set of tokens in the memory collection.
     */
    constructor3(comparator: WordComparator, terms: Set<string>): void;
    constructor(comparator: WordComparator, fileNameOrTerms?: any);
    /**
     * Adds a new term to the sorted words array. First the term is searched in the words array using binary search,
     * then the word is added into the correct place.
     * @param name Lemma of the term
     * @param termId Id of the term
     */
    addTerm(name: string, termId: number): void;
    /**
     * Saves the term dictionary into the dictionary file. Each line stores the term id and the term name separated via
     * space.
     * @param fileName Dictionary file name. Real dictionary file name is created by attaching -dictionary.txt to this
     *                 file name
     */
    save(fileName: string): void;
    /**
     * Constructs all NGrams from a given word. For example, 3 grams for word "term" are "$te", "ter", "erm", "rm$".
     * @param word Word for which NGrams will b created.
     * @param termId Term id to add into the posting list.
     * @param k N in NGram.
     * @return An array of NGrams for a given word.
     */
    static constructNGrams(word: string, termId: number, k: number): Array<TermOccurrence>;
    termComparator: (comparator: WordComparator) => (termA: TermOccurrence, termB: TermOccurrence) => number;
    /**
     * Constructs all NGrams for all words in the dictionary. For example, 3 grams for word "term" are "$te", "ter",
     * "erm", "rm$".
     * @param k N in NGram.
     * @return A sorted array of NGrams for all words in the dictionary.
     */
    constructTermsFromDictionary(k: number): Array<TermOccurrence>;
}
