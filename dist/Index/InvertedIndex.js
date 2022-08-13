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
            this.postingListComparator = (listA, listB) => (listA.size() < listB.size() ? -1 :
                (listA.size() > listB.size() ? 1 : 0));
            if (dictionaryOrFileName != undefined) {
                if (dictionaryOrFileName instanceof TermDictionary_1.TermDictionary) {
                    let dictionary = dictionaryOrFileName;
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
                else {
                    this.readPostingList(dictionaryOrFileName);
                }
            }
        }
        readPostingList(fileName) {
            let data = fs.readFileSync(fileName + "-postings.txt", "utf-8");
            let lines = data.split("\n");
            for (let i = 0; i < lines.length; i = i + 2) {
                let items = lines[i].split(" ");
                let wordId = parseInt(items[0]);
                this.index.set(wordId, new PostingList_1.PostingList(lines[i + 1]));
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
                data = data + items[1];
            }
            fs.writeFileSync(fileName + "-postings.txt", data, 'utf-8');
        }
        save(fileName) {
            let data = "";
            for (let key of this.index.keys()) {
                data = data + this.index.get(key).writeToFile(key);
            }
            fs.writeFileSync(fileName + "-postings.txt", data, 'utf-8');
        }
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