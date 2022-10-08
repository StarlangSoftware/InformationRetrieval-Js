import {DocumentText} from "./DocumentText";
import {TurkishSplitter} from "nlptoolkit-corpus/dist/TurkishSplitter";
import {MorphologicalDisambiguator} from "nlptoolkit-morphologicaldisambiguation/dist/MorphologicalDisambiguator";
import {
    FsmMorphologicalAnalyzer
} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/FsmMorphologicalAnalyzer";
import {Corpus} from "nlptoolkit-corpus/dist/Corpus";
import {Sentence} from "nlptoolkit-corpus/dist/Sentence";
import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class Document {

    private readonly absoluteFileName: string
    private readonly fileName: string
    private readonly docId: number
    private size: number = 0

    constructor(absoluteFileName: string, fileName: string, docId: number) {
        this.docId = docId
        this.absoluteFileName = absoluteFileName
        this.fileName = fileName
    }

    loadDocument(): DocumentText{
        let documentText = new DocumentText(this.absoluteFileName, new TurkishSplitter())
        this.size = documentText.numberOfWords()
        return documentText
    }

    normalizeDocument(disambiguator: MorphologicalDisambiguator, fsm: FsmMorphologicalAnalyzer){
        let corpus = new Corpus(this.absoluteFileName)
        for (let i = 0; i < corpus.sentenceCount(); i++){
            let sentence = corpus.getSentence(i)
            let parses = fsm.robustMorphologicalAnalysisFromSentence(sentence)
            let correctParses = disambiguator.disambiguate(parses)
            let newSentence = new Sentence()
            for (let fsmParse of correctParses){
                newSentence.addWord(new Word(fsmParse.getWord().getName()))
            }
            corpus.addSentence(newSentence)
        }
        this.size = corpus.numberOfWords()
        return corpus
    }

    getDocId(): number{
        return this.docId
    }

    getFileName(): string{
        return this.fileName
    }

    getAbsoluteFileName(): string{
        return this.absoluteFileName
    }

    getSize(): number{
        return this.size
    }

    setSize(size: number){
        this.size = size
    }
}