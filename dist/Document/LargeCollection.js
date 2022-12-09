(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./DiskCollection", "../Index/TermType", "../Index/TermOccurrence", "nlptoolkit-dictionary/dist/Dictionary/Word", "fs", "../Index/InvertedIndex", "../Index/TermDictionary", "../Index/PositionalIndex", "../Index/NGramIndex"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LargeCollection = void 0;
    const DiskCollection_1 = require("./DiskCollection");
    const TermType_1 = require("../Index/TermType");
    const TermOccurrence_1 = require("../Index/TermOccurrence");
    const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
    const fs = require("fs");
    const InvertedIndex_1 = require("../Index/InvertedIndex");
    const TermDictionary_1 = require("../Index/TermDictionary");
    const PositionalIndex_1 = require("../Index/PositionalIndex");
    const NGramIndex_1 = require("../Index/NGramIndex");
    class LargeCollection extends DiskCollection_1.DiskCollection {
        constructor(directory, parameter) {
            super(directory, parameter);
            this.constructDictionaryAndIndexesInDisk();
        }
        constructDictionaryAndIndexesInDisk() {
            this.constructDictionaryAndInvertedIndexInDisk(TermType_1.TermType.TOKEN);
            if (this.parameter.constructPositionalIndex()) {
                this.constructDictionaryAndPositionalIndexInDisk(TermType_1.TermType.TOKEN);
            }
            if (this.parameter.constructPhraseIndex()) {
                this.constructDictionaryAndInvertedIndexInDisk(TermType_1.TermType.PHRASE);
                if (this.parameter.constructPositionalIndex()) {
                    this.constructDictionaryAndPositionalIndexInDisk(TermType_1.TermType.PHRASE);
                }
            }
            if (this.parameter.constructNGramIndex()) {
                this.constructNGramDictionaryAndIndexInDisk();
            }
        }
        notCombinedAllDictionaries(currentWords) {
            for (let word of currentWords) {
                if (word != null) {
                    return true;
                }
            }
            return false;
        }
        selectDictionariesWithMinimumWords(currentWords) {
            let result = new Array();
            let min = null;
            for (let word of currentWords) {
                if (word != null && (min == null || TermOccurrence_1.TermOccurrence.wordComparator(this.comparator)(new Word_1.Word(word), new Word_1.Word(min)) < 0)) {
                    min = word;
                }
            }
            for (let i = 0; i < currentWords.length; i++) {
                if (currentWords[i] != null && currentWords[i] == min) {
                    result.push(i);
                }
            }
            return result;
        }
        combineMultipleDictionariesInDisk(name, tmpName, blockCount) {
            let currentIdList = new Array();
            let currentWords = new Array();
            let files = new Array();
            let filesData = new Array();
            let output = "";
            for (let i = 0; i < blockCount; i++) {
                files.push(0);
                filesData.push(fs.readFileSync("tmp-" + tmpName + i + "-dictionary.txt", "utf-8").split('\n'));
                let line = this.getLine(filesData, files, i);
                currentIdList.push(parseInt(line.substring(0, line.indexOf(" "))));
                currentWords.push(line.substring(line.indexOf(" ") + 1));
            }
            while (this.notCombinedAllDictionaries(currentWords)) {
                let indexesToCombine = this.selectDictionariesWithMinimumWords(currentWords);
                output = output + currentIdList[indexesToCombine[0]].toString() + " " + currentWords[indexesToCombine[0]].toString() + "\n";
                for (let i of indexesToCombine) {
                    let line = this.getLine(filesData, files, i);
                    if (files[i] < filesData[i].length) {
                        currentIdList[i] = parseInt(line.substring(0, line.indexOf(" ")));
                        currentWords[i] = line.substring(line.indexOf(" ") + 1);
                    }
                    else {
                        currentWords[i] = null;
                    }
                }
            }
            fs.writeFileSync(name + "-dictionary.txt", output, "utf-8");
        }
        constructDictionaryAndInvertedIndexInDisk(termType) {
            let i = 0, blockCount = 0;
            let invertedIndex = new InvertedIndex_1.InvertedIndex();
            let dictionary = new TermDictionary_1.TermDictionary(this.comparator);
            for (let doc of this.documents) {
                if (i < this.parameter.getDocumentLimit()) {
                    i++;
                }
                else {
                    dictionary.save("tmp-" + blockCount);
                    dictionary = new TermDictionary_1.TermDictionary(this.comparator);
                    invertedIndex.saveSorted("tmp-" + blockCount);
                    invertedIndex = new InvertedIndex_1.InvertedIndex();
                    blockCount++;
                    i = 0;
                }
                let documentText = doc.loadDocument();
                let wordList = documentText.constructDistinctWordList(termType);
                for (let word of wordList) {
                    let termId;
                    let wordIndex = dictionary.getWordIndex(word);
                    if (wordIndex != -1) {
                        termId = dictionary.getWord(wordIndex).getTermId();
                    }
                    else {
                        termId = Math.abs(this.hashCode(word));
                        dictionary.addTerm(word, termId);
                    }
                    invertedIndex.add(termId, doc.getDocId());
                }
            }
            if (this.documents.length != 0) {
                dictionary.save("tmp-" + blockCount);
                invertedIndex.saveSorted("tmp-" + blockCount);
                blockCount++;
            }
            if (termType == TermType_1.TermType.TOKEN) {
                this.combineMultipleDictionariesInDisk(this.name, "", blockCount);
                this.combineMultipleInvertedIndexesInDisk(this.name, "", blockCount);
            }
            else {
                this.combineMultipleDictionariesInDisk(this.name + "-phrase", "", blockCount);
                this.combineMultipleInvertedIndexesInDisk(this.name + "-phrase", "", blockCount);
            }
        }
        constructDictionaryAndPositionalIndexInDisk(termType) {
            let i = 0, blockCount = 0;
            let positionalIndex = new PositionalIndex_1.PositionalIndex();
            let dictionary = new TermDictionary_1.TermDictionary(this.comparator);
            for (let doc of this.documents) {
                if (i < this.parameter.getDocumentLimit()) {
                    i++;
                }
                else {
                    dictionary.save("tmp-" + blockCount);
                    dictionary = new TermDictionary_1.TermDictionary(this.comparator);
                    positionalIndex.saveSorted("tmp-" + blockCount);
                    positionalIndex = new PositionalIndex_1.PositionalIndex();
                    blockCount++;
                    i = 0;
                }
                let documentText = doc.loadDocument();
                let terms = documentText.constructTermList(doc.getDocId(), termType);
                for (let termOccurrence of terms) {
                    let termId;
                    let wordIndex = dictionary.getWordIndex(termOccurrence.getTerm().getName());
                    if (wordIndex != -1) {
                        termId = dictionary.getWord(wordIndex).getTermId();
                    }
                    else {
                        termId = Math.abs(this.hashCode(termOccurrence.getTerm().getName()));
                        dictionary.addTerm(termOccurrence.getTerm().getName(), termId);
                    }
                    positionalIndex.addPosition(termId, termOccurrence.getDocId(), termOccurrence.getPosition());
                }
            }
            if (this.documents.length != 0) {
                dictionary.save("tmp-" + blockCount);
                positionalIndex.saveSorted("tmp-" + blockCount);
                blockCount++;
            }
            if (termType == TermType_1.TermType.TOKEN) {
                this.combineMultipleDictionariesInDisk(this.name, "", blockCount);
                this.combineMultiplePositionalIndexesInDisk(this.name, blockCount);
            }
            else {
                this.combineMultipleDictionariesInDisk(this.name + "-phrase", "", blockCount);
                this.combineMultiplePositionalIndexesInDisk(this.name + "-phrase", blockCount);
            }
        }
        hashCode(s) {
            let hash = 0;
            for (let i = 0; i < s.length; i++) {
                let code = s.charCodeAt(i);
                hash = ((hash << 5) - hash) + code;
                hash = hash & hash;
            }
            return hash;
        }
        addNGramsToDictionaryAndIndex(line, k, nGramDictionary, nGramIndex) {
            let wordId = parseInt(line.substring(0, line.indexOf(" ")));
            let word = line.substring(line.indexOf(" ") + 1);
            let biGrams = TermDictionary_1.TermDictionary.constructNGrams(word, wordId, k);
            for (let term of biGrams) {
                let termId;
                let wordIndex = nGramDictionary.getWordIndex(term.getTerm().getName());
                if (wordIndex != -1) {
                    termId = nGramDictionary.getWord(wordIndex).getTermId();
                }
                else {
                    termId = Math.abs(this.hashCode(term.getTerm().getName()));
                    nGramDictionary.addTerm(term.getTerm().getName(), termId);
                }
                nGramIndex.add(termId, wordId);
            }
        }
        constructNGramDictionaryAndIndexInDisk() {
            let i = 0, blockCount = 0;
            let biGramDictionary = new TermDictionary_1.TermDictionary(this.comparator);
            let triGramDictionary = new TermDictionary_1.TermDictionary(this.comparator);
            let biGramIndex = new NGramIndex_1.NGramIndex();
            let triGramIndex = new NGramIndex_1.NGramIndex();
            let data = fs.readFileSync(this.name + "-dictionary.txt", 'utf-8');
            let lines = data.split('\n');
            for (let line of lines) {
                if (i < this.parameter.getWordLimit()) {
                    i++;
                }
                else {
                    biGramDictionary.save("tmp-biGram-" + blockCount);
                    triGramDictionary.save("tmp-triGram-" + blockCount);
                    biGramDictionary = new TermDictionary_1.TermDictionary(this.comparator);
                    triGramDictionary = new TermDictionary_1.TermDictionary(this.comparator);
                    biGramIndex.save("tmp-biGram-" + blockCount);
                    biGramIndex = new NGramIndex_1.NGramIndex();
                    triGramIndex.save("tmp-triGram-" + blockCount);
                    triGramIndex = new NGramIndex_1.NGramIndex();
                    blockCount++;
                    i = 0;
                }
                this.addNGramsToDictionaryAndIndex(line, 2, biGramDictionary, biGramIndex);
                this.addNGramsToDictionaryAndIndex(line, 3, triGramDictionary, triGramIndex);
            }
            if (this.documents.length != 0) {
                biGramDictionary.save("tmp-biGram-" + blockCount);
                triGramDictionary.save("tmp-triGram-" + blockCount);
                biGramIndex.save("tmp-biGram-" + blockCount);
                triGramIndex.save("tmp-triGram-" + blockCount);
                blockCount++;
            }
            this.combineMultipleDictionariesInDisk(this.name + "-biGram", "biGram-", blockCount);
            this.combineMultipleDictionariesInDisk(this.name + "-triGram", "triGram-", blockCount);
            this.combineMultipleInvertedIndexesInDisk(this.name + "-biGram", "biGram-", blockCount);
            this.combineMultipleInvertedIndexesInDisk(this.name + "-triGram", "triGram-", blockCount);
        }
    }
    exports.LargeCollection = LargeCollection;
});
//# sourceMappingURL=LargeCollection.js.map