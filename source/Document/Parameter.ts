import {IndexType} from "./IndexType";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import {MorphologicalDisambiguator} from "nlptoolkit-morphologicaldisambiguation/dist/MorphologicalDisambiguator";
import {
    FsmMorphologicalAnalyzer
} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/FsmMorphologicalAnalyzer";

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
    private indexInDisk: boolean = false
    private dictionaryInDisk: boolean = false
    private limitDocumentsLoaded: boolean = false
    private documentLimit: number = 1000
    private wordLimit: number = 10000

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

    constructIndexInDisk(): boolean {
        return this.indexInDisk
    }

    limitNumberOfDocumentsLoaded(): boolean {
        return this.limitDocumentsLoaded
    }

    getDocumentLimit(): number {
        return this.documentLimit
    }

    constructDictionaryInDisk(): boolean {
        return this.dictionaryInDisk
    }

    getWordLimit(): number {
        return this.wordLimit
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

    setConstructIndexInDisk(constructIndexInDisk: boolean) {
        this.indexInDisk = constructIndexInDisk
    }

    setLimitNumberOfDocumentsLoaded(limitNumberOfDocumentsLoaded: boolean) {
        this.limitDocumentsLoaded = limitNumberOfDocumentsLoaded
    }

    setDocumentLimit(documentLimit: number) {
        this.documentLimit = documentLimit
    }

    setConstructDictionaryInDisk(constructDictionaryInDisk: boolean) {
        this.dictionaryInDisk = constructDictionaryInDisk
        if (constructDictionaryInDisk) {
            this.indexInDisk = true
        }
    }

    setWordLimit(wordLimit: number) {
        this.wordLimit = wordLimit
    }
}