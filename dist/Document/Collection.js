(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./IndexType", "../Index/TermDictionary", "../Index/IncidenceMatrix", "../Index/NGramIndex", "../Index/InvertedIndex", "../Index/PositionalIndex", "./Document", "../Index/TermType", "fs", "../Index/TermOccurrence", "nlptoolkit-dictionary/dist/Dictionary/Word", "../Query/RetrievalType", "../Query/QueryResult", "../Index/PositionalPostingList", "../Index/PostingList"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Collection = void 0;
    const IndexType_1 = require("./IndexType");
    const TermDictionary_1 = require("../Index/TermDictionary");
    const IncidenceMatrix_1 = require("../Index/IncidenceMatrix");
    const NGramIndex_1 = require("../Index/NGramIndex");
    const InvertedIndex_1 = require("../Index/InvertedIndex");
    const PositionalIndex_1 = require("../Index/PositionalIndex");
    const Document_1 = require("./Document");
    const TermType_1 = require("../Index/TermType");
    const fs = require("fs");
    const TermOccurrence_1 = require("../Index/TermOccurrence");
    const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
    const RetrievalType_1 = require("../Query/RetrievalType");
    const QueryResult_1 = require("../Query/QueryResult");
    const PositionalPostingList_1 = require("../Index/PositionalPostingList");
    const PostingList_1 = require("../Index/PostingList");
    class Collection {
        constructor(directory, parameter) {
            this.documents = new Array();
            this.termComparator = (comparator) => (termA, termB) => (TermOccurrence_1.TermOccurrence.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) != 0 ?
                TermOccurrence_1.TermOccurrence.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) :
                (termA.getDocId() == termB.getDocId() ?
                    (termA.getPosition() == termB.getPosition() ?
                        0 : (termA.getPosition() < termB.getPosition() ?
                        -1 : 1)) :
                    (termA.getDocId() < termB.getDocId() ?
                        -1 : 1)));
            this.name = directory;
            this.indexType = parameter.getIndexType();
            this.comparator = parameter.getWordComparator();
            this.parameter = parameter;
            let files = fs.readdirSync(directory);
            files.sort();
            let fileLimit = files.length;
            if (parameter.limitNumberOfDocumentsLoaded()) {
                fileLimit = parameter.getDocumentLimit();
            }
            let i = 0;
            let j = 0;
            while (i < files.length && j < fileLimit) {
                let file = files[i];
                if (file.endsWith(".txt")) {
                    let document = new Document_1.Document(directory + "/" + file, file, j);
                    this.documents.push(document);
                    j++;
                }
                i++;
            }
            if (parameter.loadIndexesFromFile()) {
                this.dictionary = new TermDictionary_1.TermDictionary(this.comparator, directory);
                this.invertedIndex = new InvertedIndex_1.InvertedIndex(directory);
                if (parameter.constructPositionalIndex()) {
                    this.positionalIndex = new PositionalIndex_1.PositionalIndex(directory);
                    this.positionalIndex.setDocumentSizes(this.documents);
                }
                if (parameter.constructPhraseIndex()) {
                    this.phraseDictionary = new TermDictionary_1.TermDictionary(this.comparator, directory + "-phrase");
                    this.phraseIndex = new InvertedIndex_1.InvertedIndex(directory + "-phrase");
                    if (parameter.constructPositionalIndex()) {
                        this.phrasePositionalIndex = new PositionalIndex_1.PositionalIndex(directory + "-phrase");
                    }
                }
                if (parameter.constructNGramIndex()) {
                    this.biGramDictionary = new TermDictionary_1.TermDictionary(this.comparator, directory + "-biGram");
                    this.triGramDictionary = new TermDictionary_1.TermDictionary(this.comparator, directory + "-triGram");
                    this.biGramIndex = new NGramIndex_1.NGramIndex(directory + "-biGram");
                    this.triGramIndex = new NGramIndex_1.NGramIndex(directory + "-triGram");
                }
            }
            else {
                if (parameter.constructDictionaryInDisk()) {
                    this.constructDictionaryInDisk();
                }
                else {
                    if (parameter.constructIndexInDisk()) {
                        this.constructIndexesInDisk();
                    }
                    else {
                        this.constructIndexesInMemory();
                    }
                }
            }
        }
        size() {
            return this.documents.length;
        }
        vocabularySize() {
            return this.dictionary.size();
        }
        save() {
            if (this.indexType == IndexType_1.IndexType.INVERTED_INDEX) {
                this.dictionary.save(this.name);
                this.invertedIndex.save(this.name);
                if (this.parameter.constructPositionalIndex()) {
                    this.positionalIndex.save(this.name);
                }
                if (this.parameter.constructPhraseIndex()) {
                    this.phraseDictionary.save(this.name + "-phrase");
                    this.phraseIndex.save(this.name + "-phrase");
                    if (this.parameter.constructPositionalIndex()) {
                        this.phrasePositionalIndex.save(this.name + "-phrase");
                    }
                }
                if (this.parameter.constructNGramIndex()) {
                    this.biGramDictionary.save(this.name + "-biGram");
                    this.triGramDictionary.save(this.name + "-triGram");
                    this.biGramIndex.save(this.name + "-biGram");
                    this.triGramIndex.save(this.name + "-triGram");
                }
            }
        }
        constructDictionaryInDisk() {
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
        constructIndexesInMemory() {
            let terms = this.constructTerms(TermType_1.TermType.TOKEN);
            this.dictionary = new TermDictionary_1.TermDictionary(this.comparator, terms);
            switch (this.indexType) {
                case IndexType_1.IndexType.INCIDENCE_MATRIX:
                    this.incidenceMatrix = new IncidenceMatrix_1.IncidenceMatrix(this.documents.length, terms, this.dictionary);
                    break;
                case IndexType_1.IndexType.INVERTED_INDEX:
                    this.invertedIndex = new InvertedIndex_1.InvertedIndex(this.dictionary, terms, this.comparator);
                    if (this.parameter.constructPositionalIndex()) {
                        this.positionalIndex = new PositionalIndex_1.PositionalIndex(this.dictionary, terms, this.comparator);
                    }
                    if (this.parameter.constructPhraseIndex()) {
                        terms = this.constructTerms(TermType_1.TermType.PHRASE);
                        this.phraseDictionary = new TermDictionary_1.TermDictionary(this.comparator, terms);
                        this.phraseIndex = new InvertedIndex_1.InvertedIndex(this.phraseDictionary, terms, this.comparator);
                        if (this.parameter.constructPositionalIndex()) {
                            this.phrasePositionalIndex = new PositionalIndex_1.PositionalIndex(this.phraseDictionary, terms, this.comparator);
                        }
                    }
                    if (this.parameter.constructNGramIndex()) {
                        this.constructNGramIndex();
                    }
                    break;
            }
        }
        constructTerms(termType) {
            let terms = new Array();
            for (let doc of this.documents) {
                let documentText = doc.loadDocument();
                let docTerms = documentText.constructTermList(doc.getDocId(), termType);
                terms = terms.concat(docTerms);
            }
            terms.sort(this.termComparator(this.comparator));
            return terms;
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
        notCombinedAllIndexes(currentIdList) {
            for (let id of currentIdList) {
                if (id != -1) {
                    return true;
                }
            }
            return false;
        }
        notCombinedAllDictionaries(currentWords) {
            for (let word of currentWords) {
                if (word != null) {
                    return true;
                }
            }
            return false;
        }
        selectIndexesWithMinimumTermIds(currentIdList) {
            let result = new Array();
            let min = Number.MAX_VALUE;
            for (let id of currentIdList) {
                if (id != -1 && id < min) {
                    min = id;
                }
            }
            for (let i = 0; i < currentIdList.length; i++) {
                if (currentIdList[i] == min) {
                    result.push(i);
                }
            }
            return result;
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
        getLine(filesData, files, index) {
            let line = filesData[index][files[index]];
            files[index]++;
            return line;
        }
        getLines(filesData, files, index, lineCount) {
            let postingData = filesData[index].slice(files[index], files[index] + lineCount);
            files[index] += lineCount;
            return postingData;
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
        combineMultipleInvertedIndexesInDisk(name, tmpName, blockCount) {
            let currentIdList = new Array();
            let currentPostingLists = new Array();
            let files = new Array();
            let filesData = new Array();
            let output = "";
            for (let i = 0; i < blockCount; i++) {
                files.push(0);
                filesData.push(fs.readFileSync("tmp-" + tmpName + i + "-postings.txt", "utf-8").split('\n'));
                let line = this.getLine(filesData, files, i);
                let items = line.split(" ");
                currentIdList.push(parseInt(items[0]));
                line = this.getLine(filesData, files, i);
                currentPostingLists.push(new PostingList_1.PostingList(line));
            }
            while (this.notCombinedAllIndexes(currentIdList)) {
                let indexesToCombine = this.selectIndexesWithMinimumTermIds(currentIdList);
                let mergedPostingList = currentPostingLists[indexesToCombine[0]];
                for (let i = 1; i < indexesToCombine.length; i++) {
                    mergedPostingList = mergedPostingList.union(currentPostingLists[indexesToCombine[i]]);
                }
                output = output + mergedPostingList.writeToFile(currentIdList[indexesToCombine[0]]);
                for (let i of indexesToCombine) {
                    let line = this.getLine(filesData, files, i);
                    if (files[i] < filesData[i].length) {
                        let items = line.split(" ");
                        currentIdList[i] = parseInt(items[0]);
                        line = this.getLine(filesData, files, i);
                        currentPostingLists[i] = new PostingList_1.PostingList(line);
                    }
                    else {
                        currentIdList[i] = -1;
                    }
                }
            }
            fs.writeFileSync(name + "-postings.txt", output, "utf-8");
        }
        combineMultiplePositionalIndexesInDisk(name, blockCount) {
            let currentIdList = new Array();
            let currentPostingLists = new Array();
            let files = new Array();
            let filesData = new Array();
            let output = "";
            for (let i = 0; i < blockCount; i++) {
                files.push(0);
                filesData.push(fs.readFileSync("tmp-" + i + "-positionalPostings.txt", "utf-8").split('\n'));
                let line = this.getLine(filesData, files, i);
                let items = line.split(" ");
                currentIdList.push(parseInt(items[0]));
                let lineCount = parseInt(items[1]);
                currentPostingLists.push(new PositionalPostingList_1.PositionalPostingList(this.getLines(filesData, files, i, lineCount)));
            }
            while (this.notCombinedAllIndexes(currentIdList)) {
                let indexesToCombine = this.selectIndexesWithMinimumTermIds(currentIdList);
                let mergedPostingList = currentPostingLists[indexesToCombine[0]];
                for (let i = 1; i < indexesToCombine.length; i++) {
                    mergedPostingList = mergedPostingList.union(currentPostingLists[indexesToCombine[i]]);
                }
                output = output + mergedPostingList.writeToFile(currentIdList[indexesToCombine[0]]);
                for (let i of indexesToCombine) {
                    let line = this.getLine(filesData, files, i);
                    if (files[i] < filesData[i].length) {
                        let items = line.split(" ");
                        currentIdList[i] = parseInt(items[0]);
                        let lineCount = parseInt(items[1]);
                        currentPostingLists[i] = new PositionalPostingList_1.PositionalPostingList(this.getLines(filesData, files, i, lineCount));
                    }
                    else {
                        currentIdList[i] = -1;
                    }
                }
            }
            fs.writeFileSync(name + "-positionalPostings.txt", output, "utf-8");
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
        constructNGramIndex() {
            let terms = this.dictionary.constructTermsFromDictionary(2);
            this.biGramDictionary = new TermDictionary_1.TermDictionary(this.comparator, terms);
            this.biGramIndex = new NGramIndex_1.NGramIndex(this.biGramDictionary, terms, this.comparator);
            terms = this.dictionary.constructTermsFromDictionary(3);
            this.triGramDictionary = new TermDictionary_1.TermDictionary(this.comparator, terms);
            this.triGramIndex = new NGramIndex_1.NGramIndex(this.triGramDictionary, terms, this.comparator);
        }
        searchCollection(query, searchParameter) {
            switch (this.indexType) {
                case IndexType_1.IndexType.INCIDENCE_MATRIX:
                    return this.incidenceMatrix.search(query, this.dictionary);
                case IndexType_1.IndexType.INVERTED_INDEX:
                    switch (searchParameter.getRetrievalType()) {
                        case RetrievalType_1.RetrievalType.BOOLEAN: return this.invertedIndex.search(query, this.dictionary);
                        case RetrievalType_1.RetrievalType.POSITIONAL: return this.positionalIndex.positionalSearch(query, this.dictionary);
                        case RetrievalType_1.RetrievalType.RANKED: return this.positionalIndex.rankedSearch(query, this.dictionary, this.documents, searchParameter.getTermWeighting(), searchParameter.getDocumentWeighting(), searchParameter.getDocumentsRetrieved());
                    }
            }
            return new QueryResult_1.QueryResult();
        }
    }
    exports.Collection = Collection;
});
//# sourceMappingURL=Collection.js.map