(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./PositionalPosting", "../Query/QueryResult"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PositionalPostingList = void 0;
    const PositionalPosting_1 = require("./PositionalPosting");
    const QueryResult_1 = require("../Query/QueryResult");
    class PositionalPostingList {
        constructor(lines = undefined) {
            this.postings = new Array();
            if (lines != undefined) {
                for (let line of lines) {
                    let ids = line.trim().split(" ");
                    let numberOfPositionalPostings = parseInt(ids[1]);
                    let docId = parseInt(ids[0]);
                    for (let j = 0; j < numberOfPositionalPostings; j++) {
                        let positionalPosting = parseInt(ids[j + 2]);
                        this.add(docId, positionalPosting);
                    }
                }
            }
        }
        size() {
            return this.postings.length;
        }
        getIndex(docId) {
            let begin = 0, end = this.size() - 1;
            while (begin <= end) {
                let middle = Math.floor((begin + end) / 2);
                if (docId == this.postings[middle].getDocId()) {
                    return middle;
                }
                else {
                    if (docId < this.postings[middle].getDocId()) {
                        end = middle - 1;
                    }
                    else {
                        begin = middle + 1;
                    }
                }
            }
            return -1;
        }
        toQueryResult() {
            let result = new QueryResult_1.QueryResult();
            for (let posting of this.postings) {
                result.add(posting.getDocId());
            }
            return result;
        }
        add(docId, position) {
            let index = this.getIndex(docId);
            if (index == -1) {
                this.postings.push(new PositionalPosting_1.PositionalPosting(docId));
                this.postings[this.postings.length - 1].add(position);
            }
            else {
                this.postings[index].add(position);
            }
        }
        get(index) {
            return this.postings[index];
        }
        union(secondList) {
            let result = new PositionalPostingList();
            result.postings.concat(this.postings);
            result.postings.concat(secondList.postings);
            return result;
        }
        intersection(secondList) {
            let i = 0, j = 0;
            let result = new PositionalPostingList();
            while (i < this.postings.length && j < secondList.postings.length) {
                let p1 = this.postings[i];
                let p2 = secondList.postings[j];
                if (p1.getDocId() == p2.getDocId()) {
                    let position1 = 0;
                    let position2 = 0;
                    let postings1 = p1.getPositions();
                    let postings2 = p2.getPositions();
                    while (position1 < postings1.length && position2 < postings2.length) {
                        if (postings1[position1].getId() + 1 == postings2[position2].getId()) {
                            result.add(p1.getDocId(), postings2[position2].getId());
                            position1++;
                            position2++;
                        }
                        else {
                            if (postings1[position1].getId() + 1 < postings2[position2].getId()) {
                                position1++;
                            }
                            else {
                                position2++;
                            }
                        }
                    }
                    i++;
                    j++;
                }
                else {
                    if (p1.getDocId() < p2.getDocId()) {
                        i++;
                    }
                    else {
                        j++;
                    }
                }
            }
            return result;
        }
        writeToFile(index) {
            let result = "";
            if (this.size() > 0) {
                result = result + index.toString() + " " + this.size().toString() + "\n";
                result = result + this.toString();
            }
            return result;
        }
        toString() {
            let result = "";
            for (let positionalPosting of this.postings) {
                result = result + "\t" + positionalPosting.toString() + "\n";
            }
            return result;
        }
    }
    exports.PositionalPostingList = PositionalPostingList;
});
//# sourceMappingURL=PositionalPostingList.js.map