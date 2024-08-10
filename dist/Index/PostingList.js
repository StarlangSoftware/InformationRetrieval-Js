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
        /**
         * Constructs a posting list from a line, which contains postings separated with space.
         * @param line A string containing postings separated with space character.
         */
        constructor(line) {
            this.postings = new Array();
            if (line != undefined) {
                let ids = line.split(" ");
                for (let id of ids) {
                    this.add(parseInt(id));
                }
            }
        }
        /**
         * Adds a new posting (document id) to the posting list.
         * @param docId New document id to be added to the posting list.
         */
        add(docId) {
            this.postings.push(new Posting_1.Posting(docId));
        }
        /**
         * Returns the number of postings in the posting list.
         * @return Number of postings in the posting list.
         */
        size() {
            return this.postings.length;
        }
        /**
         * Algorithm for the intersection of two postings lists p1 and p2. We maintain pointers into both lists and walk
         * through the two postings lists simultaneously, in time linear in the total number of postings entries. At each
         * step, we compare the docID pointed to by both pointers. If they are the same, we put that docID in the results
         * list, and advance both pointers. Otherwise, we advance the pointer pointing to the smaller docID.
         * @param secondList p2, second posting list.
         * @return Intersection of two postings lists p1 and p2.
         */
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
        /**
         * Returns simple union of two postings list p1 and p2. The algorithm assumes the intersection of two postings list
         * is empty, therefore the union is just concatenation of two postings lists.
         * @param secondList p2
         * @return Union of two postings lists.
         */
        union(secondList) {
            let result = new PostingList();
            result.postings = result.postings.concat(this.postings);
            result.postings = result.postings.concat(secondList.postings);
            return result;
        }
        /**
         * Converts the postings list to a query result object. Simply adds all postings one by one to the result.
         * @return QueryResult object containing the postings in this object.
         */
        toQueryResult() {
            let result = new QueryResult_1.QueryResult();
            for (let posting of this.postings) {
                result.add(posting.getId());
            }
            return result;
        }
        /**
         * Prints this object into a file with the given index.
         * @param index Position of this posting list in the inverted index.
         */
        writeToFile(index) {
            let result = "";
            if (this.size() > 0) {
                result = result + index.toString() + " " + this.size().toString() + "\n";
                result = result + this.toString();
            }
            return result;
        }
        /**
         * Converts the posting list to a string. String is of the form all postings separated via space.
         * @return String form of the posting list.
         */
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