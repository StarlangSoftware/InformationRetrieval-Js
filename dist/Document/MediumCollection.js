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
        constructor(directory, parameter) {
            super(directory, parameter);
            this.constructIndexesInDisk();
        }
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