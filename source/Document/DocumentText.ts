import {Corpus} from "nlptoolkit-corpus/dist/Corpus";
import {SentenceSplitter} from "nlptoolkit-corpus/dist/SentenceSplitter";
import {TermType} from "../Index/TermType";
import {TermOccurrence} from "../Index/TermOccurrence";
import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class DocumentText extends Corpus{

    /**
     * Another constructor for the DocumentText class. Calls super with the given file name and sentence splitter.
     * @param fileName File name of the corpus
     * @param sentenceSplitter Sentence splitter class that separates sentences.
     */
    constructor(fileName: string = undefined, sentenceSplitter: SentenceSplitter = undefined) {
        super(fileName, sentenceSplitter);
    }

    /**
     * Given the corpus, creates a hash set of distinct terms. If term type is TOKEN, the terms are single word, if
     * the term type is PHRASE, the terms are bi-words.
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     * @return Hash set of terms occurring in the document.
     */
    constructDistinctWordList(termType: TermType): Set<string>{
        let words = new Set<string>()
        for (let i = 0; i < this.sentenceCount(); i++){
            let sentence = this.getSentence(i)
            for (let j = 0; j < sentence.wordCount(); j++){
                switch (termType) {
                    case TermType.TOKEN:
                        words.add(sentence.getWord(j).getName())
                        break
                    case TermType.PHRASE:
                        if (j < sentence.wordCount() - 1){
                            words.add(sentence.getWord(j).getName() + " " + sentence.getWord(j + 1).getName())
                        }
                        break
                }
            }
        }
        return words
    }

    /**
     * Given the corpus, creates an array of terms occurring in the document in that order. If term type is TOKEN, the
     * terms are single word, if the term type is PHRASE, the terms are bi-words.
     * @param docId Id of the document
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     * @return Array list of terms occurring in the document.
     */
    constructTermList(docId: number, termType: TermType): Array<TermOccurrence>{
        let terms = new Array<TermOccurrence>()
        let size = 0
        for (let i = 0; i < this.sentenceCount(); i++){
            let sentence = this.getSentence(i)
            for (let j = 0; j < sentence.wordCount(); j++){
                switch (termType) {
                    case TermType.TOKEN:
                        terms.push(new TermOccurrence(sentence.getWord(j), docId, size))
                        size = size + 1
                        break
                    case TermType.PHRASE:
                        if (j < sentence.wordCount() - 1){
                            terms.push(new TermOccurrence(new Word(sentence.getWord(j).getName() + " " + sentence.getWord(j + 1).getName()), docId, size))
                            size = size + 1
                        }
                        break
                }
            }
        }
        return terms
    }

}