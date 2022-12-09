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
        getIndexType() {
            return this.indexType;
        }
        getWordComparator() {
            return this.wordComparator;
        }
        loadIndexesFromFile() {
            return this.indexesFromFile;
        }
        getDisambiguator() {
            return this.disambiguator;
        }
        getFsm() {
            return this.fsm;
        }
        constructPhraseIndex() {
            return this.phraseIndex;
        }
        normalizeDocument() {
            return this.documentNormalization;
        }
        constructPositionalIndex() {
            return this.positionalIndex;
        }
        constructNGramIndex() {
            return this.nGramIndex;
        }
        limitNumberOfDocumentsLoaded() {
            return this.limitDocumentsLoaded;
        }
        getDocumentLimit() {
            return this.documentLimit;
        }
        getWordLimit() {
            return this.wordLimit;
        }
        getRepresentativeCount() {
            return this.representativeCount;
        }
        setIndexType(indexType) {
            this.indexType = indexType;
        }
        setWordComparator(wordComparator) {
            this.wordComparator = wordComparator;
        }
        setLoadIndexesFromFile(loadIndexesFromFile) {
            this.indexesFromFile = loadIndexesFromFile;
        }
        setDisambiguator(disambiguator) {
            this.disambiguator = disambiguator;
        }
        setFsm(fsm) {
            this.fsm = fsm;
        }
        setNormalizeDocument(normalizeDocument) {
            this.documentNormalization = normalizeDocument;
        }
        setPhraseIndex(phraseIndex) {
            this.phraseIndex = phraseIndex;
        }
        setPositionalIndex(positionalIndex) {
            this.positionalIndex = positionalIndex;
        }
        setNGramIndex(nGramIndex) {
            this.nGramIndex = nGramIndex;
        }
        setLimitNumberOfDocumentsLoaded(limitNumberOfDocumentsLoaded) {
            this.limitDocumentsLoaded = limitNumberOfDocumentsLoaded;
        }
        setDocumentLimit(documentLimit) {
            this.documentLimit = documentLimit;
        }
        setWordLimit(wordLimit) {
            this.wordLimit = wordLimit;
        }
        setRepresentativeCount(representativeCount) {
            this.representativeCount = representativeCount;
        }
        getDocumentType() {
            return this.documentType;
        }
        setDocumentType(documentType) {
            this.documentType = documentType;
        }
    }
    exports.Parameter = Parameter;
});
//# sourceMappingURL=Parameter.js.map