(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./PostingList", "./TermDictionary", "fs", "../Query/QueryResult"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvertedIndex = void 0;
    const PostingList_1 = require("./PostingList");
    const TermDictionary_1 = require("./TermDictionary");
    const fs = require("fs");
    const QueryResult_1 = require("../Query/QueryResult");
    class InvertedIndex {
        constructor(dictionaryOrFileName, terms, comparator) {
            this.index = new Map();
            this.keyComparator = (a, b) => (a[0] < b[0] ? -1 :
                (a[0] > b[0] ? 1 : 0));
            /**
             * Comparator method to compare two posting lists.
             * @param listA the first posting list to be compared.
             * @param listB the second posting list to be compared.
             * @return 1 if the size of the first posting list is larger than the second one, -1 if the size
             * of the first posting list is smaller than the second one, 0 if they are the same.
             */
            this.postingListComparator = (listA, listB) => (listA.size() < listB.size() ? -1 :
                (listA.size() > listB.size() ? 1 : 0));
            if (dictionaryOrFileName != undefined) {
                if (dictionaryOrFileName instanceof TermDictionary_1.TermDictionary) {
                    this.constructor1(dictionaryOrFileName, terms, comparator);
                }
                else {
                    this.constructor2(dictionaryOrFileName);
                }
            }
        }
        /**
         * Constructs an inverted index from a list of sorted tokens. The terms array should be sorted before calling this
         * method. Multiple occurrences of the same term from the same document are merged in the index. Instances of the
         * same term are then grouped, and the result is split into a postings list.
         * @param dictionary Term dictionary
         * @param terms Sorted list of tokens in the memory collection.
         * @param comparator Comparator method to compare two terms.
         */
        constructor1(dictionary, terms, comparator) {
            if (terms.length > 0) {
                let term = terms[0];
                let i = 1;
                let previousTerm = term;
                let termId = dictionary.getWordIndex(term.getTerm().getName());
                this.add(termId, term.getDocId());
                let prevDocId = term.getDocId();
                while (i < terms.length) {
                    term = terms[i];
                    termId = dictionary.getWordIndex(term.getTerm().getName());
                    if (termId != -1) {
                        if (term.isDifferent(previousTerm, comparator)) {
                            this.add(termId, term.getDocId());
                            prevDocId = term.getDocId();
                        }
                        else {
                            if (prevDocId != term.getDocId()) {
                                this.add(termId, term.getDocId());
                                prevDocId = term.getDocId();
                            }
                        }
                    }
                    i++;
                    previousTerm = term;
                }
            }
        }
        /**
         * Reads the inverted index from an input file.
         * @param fileName Input file name for the inverted index.
         */
        constructor2(fileName) {
            this.readPostingList(fileName);
        }
        /**
         * Reads the postings list of the inverted index from an input file. The postings are stored in two lines. The first
         * line contains the term id and the number of postings for that term. The second line contains the postings
         * list for that term.
         * @param fileName Inverted index file.
         */
        readPostingList(fileName) {
            let data = fs.readFileSync(fileName + "-postings.txt", "utf-8");
            let lines = data.split("\n");
            for (let i = 0; i < lines.length; i = i + 2) {
                if (lines[i] != "") {
                    let items = lines[i].split(" ");
                    let wordId = parseInt(items[0]);
                    this.index.set(wordId, new PostingList_1.PostingList(lines[i + 1]));
                }
            }
        }
        saveSorted(fileName) {
            let items = [];
            for (let key of this.index.keys()) {
                items.push([key, this.index.get(key).writeToFile(key)]);
            }
            items.sort(this.keyComparator);
            let data = "";
            for (let item of items) {
                data = data + item[1];
            }
            fs.writeFileSync(fileName + "-postings.txt", data, 'utf-8');
        }
        /**
         * Saves the inverted index into the index file. The postings are stored in two lines. The first
         * line contains the term id and the number of postings for that term. The second line contains the postings
         * list for that term.
         * @param fileName Index file name. Real index file name is created by attaching -postings.txt to this
         *                 file name
         */
        save(fileName) {
            let data = "";
            for (let key of this.index.keys()) {
                data = data + this.index.get(key).writeToFile(key);
            }
            fs.writeFileSync(fileName + "-postings.txt", data, 'utf-8');
        }
        /**
         * Adds a possible new term with a document id to the inverted index. First the term is searched in the hash map,
         * then the document id is put into the correct postings list.
         * @param termId Id of the term
         * @param docId Document id in which the term exists
         */
        add(termId, docId) {
            let postingList;
            if (!this.index.has(termId)) {
                postingList = new PostingList_1.PostingList();
            }
            else {
                postingList = this.index.get(termId);
            }
            postingList.add(docId);
            this.index.set(termId, postingList);
        }
        /**
         * Constructs a sorted array list of frequency counts for a word list and also sorts the word list according to
         * those frequencies.
         * @param wordList Word list for which frequency array is constructed.
         * @param dictionary Term dictionary
         */
        autoCompleteWord(wordList, dictionary) {
            let counts = new Array();
            for (let word of wordList) {
                counts.push(this.index.get(dictionary.getWordIndex(word)).size());
            }
            for (let i = 0; i < wordList.length - 1; i++) {
                for (let j = i + 1; j < wordList.length; j++) {
                    if (counts[i] < counts[j]) {
                        [counts[i], counts[j]] = [counts[j], counts[i]];
                        [wordList[i], wordList[j]] = [wordList[j], wordList[i]];
                    }
                }
            }
        }
        /**
         * Searches a given query in the document collection using inverted index boolean search.
         * @param query Query string
         * @param dictionary Term dictionary
         * @return The result of the query obtained by doing inverted index boolean search in the collection.
         */
        search(query, dictionary) {
            let queryTerms = new Array();
            for (let i = 0; i < query.size(); i++) {
                let termIndex = dictionary.getWordIndex(query.getTerm(i).getName());
                if (termIndex != -1) {
                    queryTerms.push(this.index.get(termIndex));
                }
                else {
                    return new QueryResult_1.QueryResult();
                }
            }
            queryTerms.sort(this.postingListComparator);
            let result = queryTerms[0];
            for (let i = 1; i < queryTerms.length; i++) {
                result = result.intersection(queryTerms[i]);
            }
            return result.toQueryResult();
        }
    }
    exports.InvertedIndex = InvertedIndex;
});
//# sourceMappingURL=InvertedIndex.js.map