import {IndexType} from "./IndexType";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import {MorphologicalDisambiguator} from "nlptoolkit-morphologicaldisambiguation/dist/MorphologicalDisambiguator";
import {
    FsmMorphologicalAnalyzer
} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/FsmMorphologicalAnalyzer";
import {DocumentType} from "./DocumentType";

export class Parameter {

    private indexType: IndexType = IndexType.INVERTED_INDEX
    private wordComparator: WordComparator = WordComparator.TURKISH
    private indexesFromFile: boolean = false
    private disambiguator: MorphologicalDisambiguator
    private fsm: FsmMorphologicalAnalyzer
    private documentNormalization: boolean = false
    private phraseIndex: boolean = true
    private positionalIndex: boolean = true
    private nGramIndex: boolean = true
    private limitDocumentsLoaded: boolean = false
    private documentLimit: number = 1000
    private wordLimit: number = 10000
    private documentType: DocumentType = DocumentType.NORMAL
    private representativeCount: number = 10

    constructor() {
    }

    getIndexType(): IndexType {
        return this.indexType
    }

    getWordComparator(): WordComparator {
        return this.wordComparator
    }

    loadIndexesFromFile(): boolean {
        return this.indexesFromFile
    }

    getDisambiguator(): MorphologicalDisambiguator {
        return this.disambiguator
    }

    getFsm(): FsmMorphologicalAnalyzer {
        return this.fsm
    }

    constructPhraseIndex(): boolean {
        return this.phraseIndex
    }

    normalizeDocument(): boolean {
        return this.documentNormalization
    }

    constructPositionalIndex(): boolean {
        return this.positionalIndex
    }

    constructNGramIndex(): boolean {
        return this.nGramIndex
    }

    limitNumberOfDocumentsLoaded(): boolean {
        return this.limitDocumentsLoaded
    }

    getDocumentLimit(): number {
        return this.documentLimit
    }

    getWordLimit(): number {
        return this.wordLimit
    }

    getRepresentativeCount(): number {
        return this.representativeCount
    }

    setIndexType(indexType: IndexType) {
        this.indexType = indexType
    }

    setWordComparator(wordComparator: WordComparator) {
        this.wordComparator = wordComparator
    }

    setLoadIndexesFromFile(loadIndexesFromFile: boolean) {
        this.indexesFromFile = loadIndexesFromFile
    }

    setDisambiguator(disambiguator: MorphologicalDisambiguator) {
        this.disambiguator = disambiguator
    }

    setFsm(fsm: FsmMorphologicalAnalyzer) {
        this.fsm = fsm
    }

    setNormalizeDocument(normalizeDocument: boolean) {
        this.documentNormalization = normalizeDocument
    }

    setPhraseIndex(phraseIndex: boolean) {
        this.phraseIndex = phraseIndex
    }

    setPositionalIndex(positionalIndex: boolean) {
        this.positionalIndex = positionalIndex
    }

    setNGramIndex(nGramIndex: boolean) {
        this.nGramIndex = nGramIndex
    }

    setLimitNumberOfDocumentsLoaded(limitNumberOfDocumentsLoaded: boolean) {
        this.limitDocumentsLoaded = limitNumberOfDocumentsLoaded
    }

    setDocumentLimit(documentLimit: number) {
        this.documentLimit = documentLimit
    }

    setWordLimit(wordLimit: number) {
        this.wordLimit = wordLimit
    }

    setRepresentativeCount(representativeCount: number) {
        this.representativeCount = representativeCount
    }

    getDocumentType(): DocumentType{
        return this.documentType
    }

    setDocumentType(documentType: DocumentType){
        this.documentType = documentType
    }
}