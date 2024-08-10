(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./IndexType", "nlptoolkit-dictionary/dist/Dictionary/WordComparator", "./DocumentType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Parameter = void 0;
    const IndexType_1 = require("./IndexType");
    const WordComparator_1 = require("nlptoolkit-dictionary/dist/Dictionary/WordComparator");
    const DocumentType_1 = require("./DocumentType");
    class Parameter {
        /**
         * Empty constructor for the general query search.
         */
        constructor() {
            this.indexType = IndexType_1.IndexType.INVERTED_INDEX;
            this.wordComparator = WordComparator_1.WordComparator.TURKISH;
            this.indexesFromFile = false;
            this.documentNormalization = false;
            this.phraseIndex = true;
            this.positionalIndex = true;
            this.nGramIndex = true;
            this.limitDocumentsLoaded = false;
            this.documentLimit = 1000;
            this.wordLimit = 10000;
            this.documentType = DocumentType_1.DocumentType.NORMAL;
            this.representativeCount = 10;
        }
        /**
         * Accessor for the index type search parameter. Index can be inverted index or incidence matrix.
         * @return Index type search parameter
         */
        getIndexType() {
            return this.indexType;
        }
        /**
         * Accessor for the word comparator. Word comparator is a function to compare terms.
         * @return Word comparator
         */
        getWordComparator() {
            return this.wordComparator;
        }
        /**
         * Accessor for the loadIndexesFromFile search parameter. If loadIndexesFromFile is true, all the indexes will be
         * read from the file, otherwise they will be reconstructed.
         * @return loadIndexesFromFile search parameter
         */
        loadIndexesFromFile() {
            return this.indexesFromFile;
        }
        /**
         * Accessor for the disambiguator search parameter. The disambiguator is used for morphological disambiguation for
         * the terms in Turkish.
         * @return disambiguator search parameter
         */
        getDisambiguator() {
            return this.disambiguator;
        }
        /**
         * Accessor for the fsm search parameter. The fsm is used for morphological analysis for  the terms in Turkish.
         * @return fsm search parameter
         */
        getFsm() {
            return this.fsm;
        }
        /**
         * Accessor for the constructPhraseIndex search parameter. If constructPhraseIndex is true, phrase indexes will be
         * reconstructed or used in query processing.
         * @return constructPhraseIndex search parameter
         */
        constructPhraseIndex() {
            return this.phraseIndex;
        }
        /**
         * Accessor for the normalizeDocument search parameter. If normalizeDocument is true, the terms in the document will
         * be preprocessed by morphological anaylysis and some preprocessing techniques.
         * @return normalizeDocument search parameter
         */
        normalizeDocument() {
            return this.documentNormalization;
        }
        /**
         * Accessor for the positionalIndex search parameter. If positionalIndex is true, positional indexes will be
         * reconstructed or used in query processing.
         * @return positionalIndex search parameter
         */
        constructPositionalIndex() {
            return this.positionalIndex;
        }
        /**
         * Accessor for the constructNGramIndex search parameter. If constructNGramIndex is true, N-Gram indexes will be
         * reconstructed or used in query processing.
         * @return constructNGramIndex search parameter
         */
        constructNGramIndex() {
            return this.nGramIndex;
        }
        /**
         * Accessor for the limitNumberOfDocumentsLoaded search parameter. If limitNumberOfDocumentsLoaded is true,
         * the query result will be filtered according to the documentLimit search parameter.
         * @return limitNumberOfDocumentsLoaded search parameter
         */
        limitNumberOfDocumentsLoaded() {
            return this.limitDocumentsLoaded;
        }
        /**
         * Accessor for the documentLimit search parameter. If limitNumberOfDocumentsLoaded is true,  the query result will
         * be filtered according to the documentLimit search parameter.
         * @return limitNumberOfDocumentsLoaded search parameter
         */
        getDocumentLimit() {
            return this.documentLimit;
        }
        /**
         * Accessor for the wordLimit search parameter. wordLimit is the limit on the partial term dictionary size. For
         * large collections, we term dictionaries are divided into multiple files, this parameter sets the number of terms
         * in those separate dictionaries.
         * @return wordLimit search parameter
         */
        getWordLimit() {
            return this.wordLimit;
        }
        /**
         * Accessor for the representativeCount search parameter. representativeCount is the maximum number of representative
         * words in the category based query search.
         * @return representativeCount search parameter
         */
        getRepresentativeCount() {
            return this.representativeCount;
        }
        /**
         * Mutator for the index type search parameter. Index can be inverted index or incidence matrix.
         * @param indexType Index type search parameter
         */
        setIndexType(indexType) {
            this.indexType = indexType;
        }
        /**
         * Mutator for the word comparator. Word comparator is a function to compare terms.
         * @param wordComparator Word comparator
         */
        setWordComparator(wordComparator) {
            this.wordComparator = wordComparator;
        }
        /**
         * Mutator for the loadIndexesFromFile search parameter. If loadIndexesFromFile is true, all the indexes will be
         * read from the file, otherwise they will be reconstructed.
         * @param loadIndexesFromFile loadIndexesFromFile search parameter
         */
        setLoadIndexesFromFile(loadIndexesFromFile) {
            this.indexesFromFile = loadIndexesFromFile;
        }
        /**
         * Mutator for the disambiguator search parameter. The disambiguator is used for morphological disambiguation for
         * the terms in Turkish.
         * @param disambiguator disambiguator search parameter
         */
        setDisambiguator(disambiguator) {
            this.disambiguator = disambiguator;
        }
        /**
         * Mutator for the fsm search parameter. The fsm is used for morphological analysis for the terms in Turkish.
         * @param fsm fsm search parameter
         */
        setFsm(fsm) {
            this.fsm = fsm;
        }
        /**
         * Mutator for the normalizeDocument search parameter. If normalizeDocument is true, the terms in the document will
         * be preprocessed by morphological anaylysis and some preprocessing techniques.
         * @param normalizeDocument normalizeDocument search parameter
         */
        setNormalizeDocument(normalizeDocument) {
            this.documentNormalization = normalizeDocument;
        }
        /**
         * Mutator for the constructPhraseIndex search parameter. If constructPhraseIndex is true, phrase indexes will be
         * reconstructed or used in query processing.
         * @param phraseIndex constructPhraseIndex search parameter
         */
        setPhraseIndex(phraseIndex) {
            this.phraseIndex = phraseIndex;
        }
        /**
         * Mutator for the positionalIndex search parameter. If positionalIndex is true, positional indexes will be
         * reconstructed or used in query processing.
         * @param positionalIndex positionalIndex search parameter
         */
        setPositionalIndex(positionalIndex) {
            this.positionalIndex = positionalIndex;
        }
        /**
         * Mutator for the constructNGramIndex search parameter. If constructNGramIndex is true, N-Gram indexes will be
         * reconstructed or used in query processing.
         * @param nGramIndex constructNGramIndex search parameter
         */
        setNGramIndex(nGramIndex) {
            this.nGramIndex = nGramIndex;
        }
        /**
         * Mutator for the limitNumberOfDocumentsLoaded search parameter. If limitNumberOfDocumentsLoaded is true,
         * the query result will be filtered according to the documentLimit search parameter.
         * @param limitNumberOfDocumentsLoaded limitNumberOfDocumentsLoaded search parameter
         */
        setLimitNumberOfDocumentsLoaded(limitNumberOfDocumentsLoaded) {
            this.limitDocumentsLoaded = limitNumberOfDocumentsLoaded;
        }
        /**
         * Mutator for the documentLimit search parameter. If limitNumberOfDocumentsLoaded is true,  the query result will
         * be filtered according to the documentLimit search parameter.
         * @param documentLimit documentLimit search parameter
         */
        setDocumentLimit(documentLimit) {
            this.documentLimit = documentLimit;
        }
        /**
         * Mutator for the documentLimit search parameter. If limitNumberOfDocumentsLoaded is true,  the query result will
         * be filtered according to the documentLimit search parameter.
         * @param wordLimit wordLimit search parameter
         */
        setWordLimit(wordLimit) {
            this.wordLimit = wordLimit;
        }
        /**
         * Mutator for the representativeCount search parameter. representativeCount is the maximum number of representative
         * words in the category based query search.
         * @param representativeCount representativeCount search parameter
         */
        setRepresentativeCount(representativeCount) {
            this.representativeCount = representativeCount;
        }
        /**
         * Accessor for the document type search parameter. Document can be normal or a categorical document.
         * @return Document type search parameter
         */
        getDocumentType() {
            return this.documentType;
        }
        /**
         * Mutator for the document type search parameter. Document can be normal or a categorical document.
         * @param documentType Document type search parameter
         */
        setDocumentType(documentType) {
            this.documentType = documentType;
        }
    }
    exports.Parameter = Parameter;
});
//# sourceMappingURL=Parameter.js.map