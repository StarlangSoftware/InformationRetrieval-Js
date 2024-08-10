(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./DiskCollection", "../Index/TermType", "../Index/TermDictionary", "../Index/InvertedIndex", "../Index/PositionalIndex"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MediumCollection = void 0;
    const DiskCollection_1 = require("./DiskCollection");
    const TermType_1 = require("../Index/TermType");
    const TermDictionary_1 = require("../Index/TermDictionary");
    const InvertedIndex_1 = require("../Index/InvertedIndex");
    const PositionalIndex_1 = require("../Index/PositionalIndex");
    class MediumCollection extends DiskCollection_1.DiskCollection {
        /**
         * Constructor for the MediumCollection class. In medium collections, dictionary is kept in memory and indexes are
         * stored in the disk and don't fit in memory in their construction phase and usage phase. For that reason, in their
         * construction phase, multiple disk reads and optimizations are needed.
         * @param directory Directory where the document collection resides.
         * @param parameter Search parameter
         */
        constructor(directory, parameter) {
            super(directory, parameter);
            this.constructIndexesInDisk();
        }
        /**
         * In block sort based indexing, the indexes are created in a block wise manner. They do not fit in memory, therefore
         * documents are read one by one. According to the search parameter, inverted index, positional index, phrase
         * indexes, N-Gram indexes are constructed in disk.
         */
        constructIndexesInDisk() {
            let wordList = this.constructDistinctWordList(TermType_1.TermType.TOKEN);
            this.dictionary = new TermDictionary_1.TermDictionary(this.comparator, wordList);
            this.constructInvertedIndexInDisk(this.dictionary, TermType_1.TermType.TOKEN);
            if (this.parameter.constructPositionalIndex()) {
                this.constructPositionalIndexInDisk(this.dictionary, TermType_1.TermType.TOKEN);
            }
            if (this.parameter.constructPhraseIndex()) {
                wordList = this.constructDistinctWordList(TermType_1.TermType.PHRASE);
                this.phraseDictionary = new TermDictionary_1.TermDictionary(this.comparator, wordList);
                this.constructInvertedIndexInDisk(this.phraseDictionary, TermType_1.TermType.PHRASE);
                if (this.parameter.constructPositionalIndex()) {
                    this.constructPositionalIndexInDisk(this.phraseDictionary, TermType_1.TermType.PHRASE);
                }
            }
            if (this.parameter.constructNGramIndex()) {
                this.constructNGramIndex();
            }
        }
        /**
         * Given the document collection, creates a hash set of distinct terms. If term type is TOKEN, the terms are single
         * word, if the term type is PHRASE, the terms are bi-words. Each document is loaded into memory and distinct
         * word list is created. Since the dictionary can be kept in memory, all operations can be done in memory.
         * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
         *                 bi-words.
         * @return Hash set of terms occurring in the document collection.
         */
        constructDistinctWordList(termType) {
            let words = new Set();
            for (let doc of this.documents) {
                let documentText = doc.loadDocument();
                let wordList = documentText.constructDistinctWordList(termType);
                for (let word of wordList) {
                    words.add(word);
                }
            }
            return words;
        }
        /**
         * In block sort based indexing, the inverted index is created in a block wise manner. It does not fit in memory,
         * therefore documents are read one by one. For each document, the terms are added to the inverted index. If the
         * number of documents read are above the limit, current partial inverted index file is saved and new inverted index
         * file is open. After reading all documents, we combine the inverted index files to get the final inverted index
         * file.
         * @param dictionary Term dictionary.
         * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
         *                 bi-words.
         */
        constructInvertedIndexInDisk(dictionary, termType) {
            let i = 0, blockCount = 0;
            let invertedIndex = new InvertedIndex_1.InvertedIndex();
            for (let doc of this.documents) {
                if (i < this.parameter.getDocumentLimit()) {
                    i++;
                }
                else {
                    invertedIndex.saveSorted("tmp-" + blockCount);
                    invertedIndex = new InvertedIndex_1.InvertedIndex();
                    blockCount++;
                    i = 0;
                }
                let documentText = doc.loadDocument();
                let wordList = documentText.constructDistinctWordList(termType);
                for (let word of wordList) {
                    let termId = dictionary.getWordIndex(word);
                    invertedIndex.add(termId, doc.getDocId());
                }
            }
            if (this.documents.length != 0) {
                invertedIndex.saveSorted("tmp-" + blockCount);
                blockCount++;
            }
            if (termType == TermType_1.TermType.TOKEN) {
                this.combineMultipleInvertedIndexesInDisk(this.name, "", blockCount);
            }
            else {
                this.combineMultipleInvertedIndexesInDisk(this.name + "-phrase", "", blockCount);
            }
        }
        /**
         * In block sort based indexing, the positional index is created in a block wise manner. It does not fit in memory,
         * therefore documents are read one by one. For each document, the terms are added to the positional index. If the
         * number of documents read are above the limit, current partial positional index file is saved and new positional
         * index file is open. After reading all documents, we combine the posiitonal index files to get the final
         * positional index file.
         * @param dictionary Term dictionary.
         * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
         *                 bi-words.
         */
        constructPositionalIndexInDisk(dictionary, termType) {
            let i = 0, blockCount = 0;
            let positionalIndex = new PositionalIndex_1.PositionalIndex();
            for (let doc of this.documents) {
                if (i < this.parameter.getDocumentLimit()) {
                    i++;
                }
                else {
                    positionalIndex.saveSorted("tmp-" + blockCount);
                    positionalIndex = new PositionalIndex_1.PositionalIndex();
                    blockCount++;
                    i = 0;
                }
                let documentText = doc.loadDocument();
                let terms = documentText.constructTermList(doc.getDocId(), termType);
                for (let termOccurrence of terms) {
                    let termId = dictionary.getWordIndex(termOccurrence.getTerm().getName());
                    positionalIndex.addPosition(termId, termOccurrence.getDocId(), termOccurrence.getPosition());
                }
            }
            if (this.documents.length != 0) {
                positionalIndex.saveSorted("tmp-" + blockCount);
                blockCount++;
            }
            if (termType == TermType_1.TermType.TOKEN) {
                this.combineMultiplePositionalIndexesInDisk(this.name, blockCount);
            }
            else {
                this.combineMultiplePositionalIndexesInDisk(this.name + "-phrase", blockCount);
            }
        }
    }
    exports.MediumCollection = MediumCollection;
});
//# sourceMappingURL=MediumCollection.js.map