(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Posting", "../Query/QueryResult"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostingList = void 0;
    const Posting_1 = require("./Posting");
    const QueryResult_1 = require("../Query/QueryResult");
    class PostingList {
        constructor(line) {
            this.postings = new Array();
            if (line != undefined) {
                let ids = line.split(" ");
                for (let id of ids) {
                    this.add(parseInt(id));
                }
            }
        }
        add(docId) {
            this.postings.push(new Posting_1.Posting(docId));
        }
        size() {
            return this.postings.length;
        }
        intersection(secondList) {
            let i = 0, j = 0;
            let result = new PostingList();
            while (i < this.size() && j < secondList.size()) {
                let p1 = this.postings[i];
                let p2 = secondList.postings[j];
                if (p1.getId() == p2.getId()) {
                    result.add(p1.getId());
                    i++;
                    j++;
                }
                else {
                    if (p1.getId() < p2.getId()) {
                        i++;
                    }
                    else {
                        j++;
                    }
                }
            }
            return result;
        }
        union(secondList) {
            let result = new PostingList();
            result.postings = result.postings.concat(this.postings);
            result.postings = result.postings.concat(secondList.postings);
            return result;
        }
        toQueryResult() {
            let result = new QueryResult_1.QueryResult();
            for (let posting of this.postings) {
                result.add(posting.getId());
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
            for (let posting of this.postings) {
                result = result + posting.getId().toString() + " ";
            }
            return result.trim() + "\n";
        }
    }
    exports.PostingList = PostingList;
});
//# sourceMappingURL=PostingList.js.map