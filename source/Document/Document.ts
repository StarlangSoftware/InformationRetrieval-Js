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

    /**
     * Constructor for the Document class. Sets the attributes.
     * @param documentType Type of the document. Can be normal for normal documents, categorical for categorical
     *                     documents.
     * @param absoluteFileName Absolute file name of the document
     * @param fileName Relative file name of the document.
     * @param docId Id of the document
     */
    constructor(documentType: DocumentType, absoluteFileName: string, fileName: string, docId: number) {
        this.docId = docId
        this.absoluteFileName = absoluteFileName
        this.fileName = fileName
        this.documentType = documentType
    }

    /**
     * Loads the document from input stream. For normal documents, it reads as a corpus. For categorical documents, the
     * first line contains categorical information, second line contains name of the product, third line contains
     * detailed info about the product.
     * @return Loaded document text.
     */
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

    /**
     * Loads the category of the document and adds it to the category tree. Category information is stored in the first
     * line of the document.
     * @param categoryTree Category tree to which new product will be added.
     */
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

    /**
     * Accessor for the docId attribute.
     * @return docId attribute.
     */
    getDocId(): number{
        return this.docId
    }

    /**
     * Accessor for the fileName attribute.
     * @return fileName attribute.
     */
    getFileName(): string{
        return this.fileName
    }

    /**
     * Accessor for the absoluteFileName attribute.
     * @return absoluteFileName attribute.
     */
    getAbsoluteFileName(): string{
        return this.absoluteFileName
    }

    /**
     * Accessor for the size attribute.
     * @return size attribute.
     */
    getSize(): number{
        return this.size
    }

    /**
     * Mutator for the size attribute.
     * @param size New size attribute.
     */
    setSize(size: number){
        this.size = size
    }

    /**
     * Mutator for the category attribute.
     * @param categoryTree Category tree to which new category will be added.
     * @param category New category that will be added
     */
    setCategory(categoryTree: CategoryTree, category: string){
        this.category = categoryTree.addCategoryHierarchy(category)
    }

    /**
     * Accessor for the category attribute.
     * @return Category attribute as a String
     */
    getCategory(): string{
        return this.category.toString()
    }

    /**
     * Accessor for the category attribute.
     * @return Category attribute as a CategoryNode.
     */
    getCategoryNode(): CategoryNode{
        return this.category
    }
}