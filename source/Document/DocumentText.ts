import {Corpus} from "nlptoolkit-corpus/dist/Corpus";
import {SentenceSplitter} from "nlptoolkit-corpus/dist/SentenceSplitter";
import {TermType} from "../Index/TermType";
import {TermOccurrence} from "../Index/TermOccurrence";
import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class DocumentText extends Corpus{

    constructor(fileName: string = undefined, sentenceSplitter: SentenceSplitter = undefined) {
        super(fileName, sentenceSplitter);
    }

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