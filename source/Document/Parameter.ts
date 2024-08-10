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

    /**
     * Empty constructor for the general query search.
     */
    constructor() {
    }

    /**
     * Accessor for the index type search parameter. Index can be inverted index or incidence matrix.
     * @return Index type search parameter
     */
    getIndexType(): IndexType {
        return this.indexType
    }

    /**
     * Accessor for the word comparator. Word comparator is a function to compare terms.
     * @return Word comparator
     */
    getWordComparator(): WordComparator {
        return this.wordComparator
    }

    /**
     * Accessor for the loadIndexesFromFile search parameter. If loadIndexesFromFile is true, all the indexes will be
     * read from the file, otherwise they will be reconstructed.
     * @return loadIndexesFromFile search parameter
     */
    loadIndexesFromFile(): boolean {
        return this.indexesFromFile
    }

    /**
     * Accessor for the disambiguator search parameter. The disambiguator is used for morphological disambiguation for
     * the terms in Turkish.
     * @return disambiguator search parameter
     */
    getDisambiguator(): MorphologicalDisambiguator {
        return this.disambiguator
    }

    /**
     * Accessor for the fsm search parameter. The fsm is used for morphological analysis for  the terms in Turkish.
     * @return fsm search parameter
     */
    getFsm(): FsmMorphologicalAnalyzer {
        return this.fsm
    }

    /**
     * Accessor for the constructPhraseIndex search parameter. If constructPhraseIndex is true, phrase indexes will be
     * reconstructed or used in query processing.
     * @return constructPhraseIndex search parameter
     */
    constructPhraseIndex(): boolean {
        return this.phraseIndex
    }

    /**
     * Accessor for the normalizeDocument search parameter. If normalizeDocument is true, the terms in the document will
     * be preprocessed by morphological anaylysis and some preprocessing techniques.
     * @return normalizeDocument search parameter
     */
    normalizeDocument(): boolean {
        return this.documentNormalization
    }

    /**
     * Accessor for the positionalIndex search parameter. If positionalIndex is true, positional indexes will be
     * reconstructed or used in query processing.
     * @return positionalIndex search parameter
     */
    constructPositionalIndex(): boolean {
        return this.positionalIndex
    }

    /**
     * Accessor for the constructNGramIndex search parameter. If constructNGramIndex is true, N-Gram indexes will be
     * reconstructed or used in query processing.
     * @return constructNGramIndex search parameter
     */
    constructNGramIndex(): boolean {
        return this.nGramIndex
    }

    /**
     * Accessor for the limitNumberOfDocumentsLoaded search parameter. If limitNumberOfDocumentsLoaded is true,
     * the query result will be filtered according to the documentLimit search parameter.
     * @return limitNumberOfDocumentsLoaded search parameter
     */
    limitNumberOfDocumentsLoaded(): boolean {
        return this.limitDocumentsLoaded
    }

    /**
     * Accessor for the documentLimit search parameter. If limitNumberOfDocumentsLoaded is true,  the query result will
     * be filtered according to the documentLimit search parameter.
     * @return limitNumberOfDocumentsLoaded search parameter
     */
    getDocumentLimit(): number {
        return this.documentLimit
    }

    /**
     * Accessor for the wordLimit search parameter. wordLimit is the limit on the partial term dictionary size. For
     * large collections, we term dictionaries are divided into multiple files, this parameter sets the number of terms
     * in those separate dictionaries.
     * @return wordLimit search parameter
     */
    getWordLimit(): number {
        return this.wordLimit
    }

    /**
     * Accessor for the representativeCount search parameter. representativeCount is the maximum number of representative
     * words in the category based query search.
     * @return representativeCount search parameter
     */
    getRepresentativeCount(): number {
        return this.representativeCount
    }

    /**
     * Mutator for the index type search parameter. Index can be inverted index or incidence matrix.
     * @param indexType Index type search parameter
     */
    setIndexType(indexType: IndexType) {
        this.indexType = indexType
    }

    /**
     * Mutator for the word comparator. Word comparator is a function to compare terms.
     * @param wordComparator Word comparator
     */
    setWordComparator(wordComparator: WordComparator) {
        this.wordComparator = wordComparator
    }

    /**
     * Mutator for the loadIndexesFromFile search parameter. If loadIndexesFromFile is true, all the indexes will be
     * read from the file, otherwise they will be reconstructed.
     * @param loadIndexesFromFile loadIndexesFromFile search parameter
     */
    setLoadIndexesFromFile(loadIndexesFromFile: boolean) {
        this.indexesFromFile = loadIndexesFromFile
    }

    /**
     * Mutator for the disambiguator search parameter. The disambiguator is used for morphological disambiguation for
     * the terms in Turkish.
     * @param disambiguator disambiguator search parameter
     */
    setDisambiguator(disambiguator: MorphologicalDisambiguator) {
        this.disambiguator = disambiguator
    }

    /**
     * Mutator for the fsm search parameter. The fsm is used for morphological analysis for the terms in Turkish.
     * @param fsm fsm search parameter
     */
    setFsm(fsm: FsmMorphologicalAnalyzer) {
        this.fsm = fsm
    }

    /**
     * Mutator for the normalizeDocument search parameter. If normalizeDocument is true, the terms in the document will
     * be preprocessed by morphological anaylysis and some preprocessing techniques.
     * @param normalizeDocument normalizeDocument search parameter
     */
    setNormalizeDocument(normalizeDocument: boolean) {
        this.documentNormalization = normalizeDocument
    }

    /**
     * Mutator for the constructPhraseIndex search parameter. If constructPhraseIndex is true, phrase indexes will be
     * reconstructed or used in query processing.
     * @param phraseIndex constructPhraseIndex search parameter
     */
    setPhraseIndex(phraseIndex: boolean) {
        this.phraseIndex = phraseIndex
    }

    /**
     * Mutator for the positionalIndex search parameter. If positionalIndex is true, positional indexes will be
     * reconstructed or used in query processing.
     * @param positionalIndex positionalIndex search parameter
     */
    setPositionalIndex(positionalIndex: boolean) {
        this.positionalIndex = positionalIndex
    }

    /**
     * Mutator for the constructNGramIndex search parameter. If constructNGramIndex is true, N-Gram indexes will be
     * reconstructed or used in query processing.
     * @param nGramIndex constructNGramIndex search parameter
     */
    setNGramIndex(nGramIndex: boolean) {
        this.nGramIndex = nGramIndex
    }

    /**
     * Mutator for the limitNumberOfDocumentsLoaded search parameter. If limitNumberOfDocumentsLoaded is true,
     * the query result will be filtered according to the documentLimit search parameter.
     * @param limitNumberOfDocumentsLoaded limitNumberOfDocumentsLoaded search parameter
     */
    setLimitNumberOfDocumentsLoaded(limitNumberOfDocumentsLoaded: boolean) {
        this.limitDocumentsLoaded = limitNumberOfDocumentsLoaded
    }

    /**
     * Mutator for the documentLimit search parameter. If limitNumberOfDocumentsLoaded is true,  the query result will
     * be filtered according to the documentLimit search parameter.
     * @param documentLimit documentLimit search parameter
     */
    setDocumentLimit(documentLimit: number) {
        this.documentLimit = documentLimit
    }

    /**
     * Mutator for the documentLimit search parameter. If limitNumberOfDocumentsLoaded is true,  the query result will
     * be filtered according to the documentLimit search parameter.
     * @param wordLimit wordLimit search parameter
     */
    setWordLimit(wordLimit: number) {
        this.wordLimit = wordLimit
    }

    /**
     * Mutator for the representativeCount search parameter. representativeCount is the maximum number of representative
     * words in the category based query search.
     * @param representativeCount representativeCount search parameter
     */
    setRepresentativeCount(representativeCount: number) {
        this.representativeCount = representativeCount
    }

    /**
     * Accessor for the document type search parameter. Document can be normal or a categorical document.
     * @return Document type search parameter
     */
    getDocumentType(): DocumentType{
        return this.documentType
    }

    /**
     * Mutator for the document type search parameter. Document can be normal or a categorical document.
     * @param documentType Document type search parameter
     */
    setDocumentType(documentType: DocumentType){
        this.documentType = documentType
    }
}