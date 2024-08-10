import { Corpus } from "nlptoolkit-corpus/dist/Corpus";
import { SentenceSplitter } from "nlptoolkit-corpus/dist/SentenceSplitter";
import { TermType } from "../Index/TermType";
import { TermOccurrence } from "../Index/TermOccurrence";
export declare class DocumentText extends Corpus {
    /**
     * Another constructor for the DocumentText class. Calls super with the given file name and sentence splitter.
     * @param fileName File name of the corpus
     * @param sentenceSplitter Sentence splitter class that separates sentences.
     */
    constructor(fileName?: string, sentenceSplitter?: SentenceSplitter);
    /**
     * Given the corpus, creates a hash set of distinct terms. If term type is TOKEN, the terms are single word, if
     * the term type is PHRASE, the terms are bi-words.
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     * @return Hash set of terms occurring in the document.
     */
    constructDistinctWordList(termType: TermType): Set<string>;
    /**
     * Given the corpus, creates an array of terms occurring in the document in that order. If term type is TOKEN, the
     * terms are single word, if the term type is PHRASE, the terms are bi-words.
     * @param docId Id of the document
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     * @return Array list of terms occurring in the document.
     */
    constructTermList(docId: number, termType: TermType): Array<TermOccurrence>;
}
