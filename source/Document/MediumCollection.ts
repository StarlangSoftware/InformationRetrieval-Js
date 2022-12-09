import {DiskCollection} from "./DiskCollection";
import {Parameter} from "./Parameter";
import {TermType} from "../Index/TermType";
import {TermDictionary} from "../Index/TermDictionary";
import {InvertedIndex} from "../Index/InvertedIndex";
import {PositionalIndex} from "../Index/PositionalIndex";

export class MediumCollection extends DiskCollection{

    constructor(directory: string, parameter: Parameter) {
        super(directory, parameter)
        this.constructIndexesInDisk()
    }

    constructIndexesInDisk(){
        let wordList = this.constructDistinctWordList(TermType.TOKEN);
        this.dictionary = new TermDictionary(this.comparator, wordList)
        this.constructInvertedIndexInDisk(this.dictionary, TermType.TOKEN)
        if (this.parameter.constructPositionalIndex()){
            this.constructPositionalIndexInDisk(this.dictionary, TermType.TOKEN)
        }
        if (this.parameter.constructPhraseIndex()){
            wordList = this.constructDistinctWordList(TermType.PHRASE)
            this.phraseDictionary = new TermDictionary(this.comparator, wordList)
            this.constructInvertedIndexInDisk(this.phraseDictionary, TermType.PHRASE)
            if (this.parameter.constructPositionalIndex()){
                this.constructPositionalIndexInDisk(this.phraseDictionary, TermType.PHRASE)
            }
        }
        if (this.parameter.constructNGramIndex()){
            this.constructNGramIndex()
        }
    }

    constructDistinctWordList(termType: TermType): Set<string>{
        let words = new Set<string>()
        for (let doc of this.documents){
            let documentText = doc.loadDocument()
            let wordList = documentText.constructDistinctWordList(termType)
            for (let word of wordList){
                words.add(word)
            }
        }
        return words
    }

    constructInvertedIndexInDisk(dictionary: TermDictionary, termType: TermType){
        let i = 0, blockCount = 0
        let invertedIndex = new InvertedIndex()
        for (let doc of this.documents){
            if (i < this.parameter.getDocumentLimit()){
                i++
            } else {
                invertedIndex.saveSorted("tmp-" + blockCount)
                invertedIndex = new InvertedIndex()
                blockCount++
                i = 0
            }
            let documentText = doc.loadDocument()
            let wordList = documentText.constructDistinctWordList(termType)
            for (let word of wordList){
                let termId = dictionary.getWordIndex(word)
                invertedIndex.add(termId, doc.getDocId())
            }
        }
        if (this.documents.length != 0){
            invertedIndex.saveSorted("tmp-" + blockCount)
            blockCount++
        }
        if (termType == TermType.TOKEN){
            this.combineMultipleInvertedIndexesInDisk(this.name, "", blockCount)
        } else {
            this.combineMultipleInvertedIndexesInDisk(this.name + "-phrase", "", blockCount)
        }
    }

    constructPositionalIndexInDisk(dictionary: TermDictionary, termType: TermType){
        let i = 0, blockCount = 0
        let positionalIndex = new PositionalIndex()
        for (let doc of this.documents){
            if (i < this.parameter.getDocumentLimit()){
                i++
            } else {
                positionalIndex.saveSorted("tmp-" + blockCount)
                positionalIndex = new PositionalIndex()
                blockCount++
                i = 0;
            }
            let documentText = doc.loadDocument()
            let terms = documentText.constructTermList(doc.getDocId(), termType)
            for (let termOccurrence of terms){
                let termId = dictionary.getWordIndex(termOccurrence.getTerm().getName());
                positionalIndex.addPosition(termId, termOccurrence.getDocId(), termOccurrence.getPosition())
            }
        }
        if (this.documents.length != 0){
            positionalIndex.saveSorted("tmp-" + blockCount);
            blockCount++;
        }
        if (termType == TermType.TOKEN){
            this.combineMultiplePositionalIndexesInDisk(this.name, blockCount)
        } else {
            this.combineMultiplePositionalIndexesInDisk(this.name + "-phrase", blockCount)
        }
    }

}