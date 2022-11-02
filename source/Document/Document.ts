import {DocumentText} from "./DocumentText";
import {TurkishSplitter} from "nlptoolkit-corpus/dist/TurkishSplitter";
import {MorphologicalDisambiguator} from "nlptoolkit-morphologicaldisambiguation/dist/MorphologicalDisambiguator";
import {
    FsmMorphologicalAnalyzer
} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/FsmMorphologicalAnalyzer";
import {Corpus} from "nlptoolkit-corpus/dist/Corpus";
import {Sentence} from "nlptoolkit-corpus/dist/Sentence";
import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";
import {DocumentType} from "./DocumentType";
import {CategoryNode} from "../Index/CategoryNode";
import {CategoryTree} from "../Index/CategoryTree";

export class Document {

    private readonly absoluteFileName: string
    private readonly fileName: string
    private readonly docId: number
    private size: number = 0
    private readonly documentType: DocumentType
    private category: CategoryNode

    constructor(documentType: DocumentType, absoluteFileName: string, fileName: string, docId: number) {
        this.docId = docId
        this.absoluteFileName = absoluteFileName
        this.fileName = fileName
        this.documentType = documentType
    }

    loadDocument(): DocumentText{
        let documentText
        switch (this.documentType) {
            case DocumentType.NORMAL:
                documentText = new DocumentText(this.absoluteFileName, new TurkishSplitter())
                this.size = documentText.numberOfWords()
                break;
            case DocumentType.CATEGORICAL:
                let corpus = new Corpus(this.absoluteFileName)
                if (corpus.sentenceCount() >= 2){
                    documentText = new DocumentText()
                    let sentences = new TurkishSplitter().split(corpus.getSentence(1).toString())
                    for (let sentence of sentences){
                        documentText.addSentence(sentence)
                    }
                    this.size = documentText.numberOfWords()
                } else {
                    return null
                }
                break;
        }
        return documentText
    }

    loadCategory(categoryTree: CategoryTree){
        if (this.documentType == DocumentType.CATEGORICAL){
            let corpus = new Corpus(this.absoluteFileName)
            if (corpus.sentenceCount() >= 2) {
                this.category = categoryTree.addCategoryHierarchy(corpus.getSentence(0).toString())
            }
        }
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

    setCategory(categoryTree: CategoryTree, category: string){
        this.category = categoryTree.addCategoryHierarchy(category)
    }

    getCategory(): string{
        return this.category.toString()
    }

    getCategoryNode(): CategoryNode{
        return this.category
    }
}