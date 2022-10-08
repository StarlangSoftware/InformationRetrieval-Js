(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./PositionalPostingList", "./TermDictionary", "fs", "../Query/QueryResult", "../Query/VectorSpaceModel"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PositionalIndex = void 0;
    const PositionalPostingList_1 = require("./PositionalPostingList");
    const TermDictionary_1 = require("./TermDictionary");
    const fs = require("fs");
    const QueryResult_1 = require("../Query/QueryResult");
    const VectorSpaceModel_1 = require("../Query/VectorSpaceModel");
    class PositionalIndex {
        constructor(dictionaryOrFileName, terms, comparator) {
            this.positionalIndex = new Map();
            this.keyComparator = (a, b) => (a[0] < b[0] ? -1 :
                (a[0] > b[0] ? 1 : 0));
            if (dictionaryOrFileName != undefined) {
                if (dictionaryOrFileName instanceof TermDictionary_1.TermDictionary) {
                    let dictionary = dictionaryOrFileName;
                    if (terms.length > 0) {
                        let term = terms[0];
                        let i = 1;
                        let previousTerm = term;
                        let termId = dictionary.getWordIndex(term.getTerm().getName());
                        this.addPosition(termId, term.getDocId(), term.getPosition());
                        let prevDocId = term.getDocId();
                        while (i < terms.length) {
                            term = terms[i];
                            termId = dictionary.getWordIndex(term.getTerm().getName());
                            if (termId != -1) {
                                if (term.isDifferent(previousTerm, comparator)) {
                                    this.addPosition(termId, term.getDocId(), term.getPosition());
                                    prevDocId = term.getDocId();
                                }
                                else {
                                    if (prevDocId != term.getDocId()) {
                                        this.addPosition(termId, term.getDocId(), term.getPosition());
                                        prevDocId = term.getDocId();
                                    }
                                    else {
                                        this.addPosition(termId, term.getDocId(), term.getPosition());
                                    }
                                }
                            }
                            i++;
                            previousTerm = term;
                        }
                    }
                }
                else {
                    this.readPositionalPostingList(dictionaryOrFileName);
                }
            }
        }
        readPositionalPostingList(fileName) {
            let data = fs.readFileSync(fileName + "-positionalPostings.txt", "utf-8");
            let lines = data.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (lines[i] != "") {
                    let items = lines[i].split(" ");
                    let wordId = parseInt(items[0]);
                    let count = parseInt(items[1]);
                    this.positionalIndex.set(wordId, new PositionalPostingList_1.PositionalPostingList(lines.slice(i + 1, i + count + 1)));
                    i += count;
                }
            }
        }
        saveSorted(fileName) {
            let items = [];
            for (let key of this.positionalIndex.keys()) {
                items.push([key, this.positionalIndex.get(key).writeToFile(key)]);
            }
            items.sort(this.keyComparator);
            let data = "";
            for (let item of items) {
                data = data + item[1];
            }
            fs.writeFileSync(fileName + "-positionalPostings.txt", data, 'utf-8');
        }
        save(fileName) {
            let data = "";
            for (let key of this.positionalIndex.keys()) {
                data = data + this.positionalIndex.get(key).writeToFile(key);
            }
            fs.writeFileSync(fileName + "-positionalPostings.txt", data, 'utf-8');
        }
        addPosition(termId, docId, position) {
            let positionalPostingList;
            if (!this.positionalIndex.has(termId)) {
                positionalPostingList = new PositionalPostingList_1.PositionalPostingList();
            }
            else {
                positionalPostingList = this.positionalIndex.get(termId);
            }
            positionalPostingList.add(docId, position);
            this.positionalIndex.set(termId, positionalPostingList);
        }
        positionalSearch(query, dictionary) {
            let postingResult = null;
            for (let i = 0; i < query.size(); i++) {
                let term = dictionary.getWordIndex(query.getTerm(i).getName());
                if (term != -1) {
                    if (i == 0) {
                        postingResult = this.positionalIndex.get(term);
                    }
                    else {
                        if (postingResult != null) {
                            postingResult = postingResult.intersection(this.positionalIndex.get(term));
                        }
                        else {
                            return new QueryResult_1.QueryResult();
                        }
                    }
                }
                else {
                    return new QueryResult_1.QueryResult();
                }
            }
            if (postingResult != null) {
                return postingResult.toQueryResult();
            }
            else {
                return new QueryResult_1.QueryResult();
            }
        }
        getTermFrequencies(docId) {
            let tf = new Array();
            let i = 0;
            for (let key of this.positionalIndex.keys()) {
                let positionalPostingList = this.positionalIndex.get(key);
                let index = positionalPostingList.getIndex(docId);
                if (index != -1) {
                    tf.push(positionalPostingList.get(index).size());
                }
                else {
                    tf.push(0);
                }
                i++;
            }
            return tf;
        }
        getDocumentFrequencies() {
            let df = new Array();
            let i = 0;
            for (let key of this.positionalIndex.keys()) {
                df.push(this.positionalIndex.get(key).size());
                i++;
            }
            return df;
        }
        setDocumentSizes(documents) {
            let sizes = new Array();
            for (let i = 0; i < documents.length; i++) {
                sizes.push(0);
            }
            for (let key of this.positionalIndex.keys()) {
                let positionalPostingList = this.positionalIndex.get(key);
                for (let j = 0; j < positionalPostingList.size(); j++) {
                    let positionalPosting = positionalPostingList.get(j);
                    let docId = positionalPosting.getDocId();
                    sizes[docId] += positionalPosting.size();
                }
            }
            for (let doc of documents) {
                doc.setSize(sizes[doc.getDocId()]);
            }
        }
        rankedSearch(query, dictionary, documents, termWeighting, documentWeighting) {
            let N = documents.length;
            let result = new QueryResult_1.QueryResult();
            let scores = new Array();
            for (let i = 0; i < N; i++) {
                scores.push(0.0);
            }
            for (let i = 0; i < query.size(); i++) {
                let term = dictionary.getWordIndex(query.getTerm(i).getName());
                if (term != -1) {
                    let positionalPostingList = this.positionalIndex.get(term);
                    for (let j = 0; j < positionalPostingList.size(); j++) {
                        let positionalPosting = positionalPostingList.get(j);
                        let docID = positionalPosting.getDocId();
                        let tf = positionalPosting.size();
                        let df = this.positionalIndex.get(term).size();
                        if (tf > 0 && df > 0) {
                            scores[docID] += VectorSpaceModel_1.VectorSpaceModel.weighting(tf, df, N, termWeighting, documentWeighting);
                        }
                    }
                }
            }
            for (let i = 0; i < N; i++) {
                scores[i] /= documents[i].getSize();
                if (scores[i] > 0.0) {
                    result.add(i, scores[i]);
                }
            }
            result.sort();
            return result;
        }
    }
    exports.PositionalIndex = PositionalIndex;
});
//# sourceMappingURL=PositionalIndex.js.map