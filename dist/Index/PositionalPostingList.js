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
        /**
         * Reads a positional posting list from a file. Reads N lines, where each line stores a positional posting. The
         * first item in the line shows document id. The second item in the line shows the number of positional postings.
         * Other items show the positional postings.
         * @param lines Lines read from the input file.
         */
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
        /**
         * Returns the number of positional postings in the posting list.
         * @return Number of positional postings in the posting list.
         */
        size() {
            return this.postings.length;
        }
        /**
         * Does a binary search on the positional postings list for a specific document id.
         * @param docId Document id to be searched.
         * @return The position of the document id in the positional posting list. If it does not exist, the method returns
         * -1.
         */
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
        /**
         * Converts the positional postings list to a query result object. Simply adds all positional postings one by one
         * to the result.
         * @return QueryResult object containing the positional postings in this object.
         */
        toQueryResult() {
            let result = new QueryResult_1.QueryResult();
            for (let posting of this.postings) {
                result.add(posting.getDocId());
            }
            return result;
        }
        /**
         * Adds a new positional posting (document id and position) to the posting list.
         * @param docId New document id to be added to the positional posting list.
         * @param position New position to be added to the positional posting list.
         */
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
        /**
         * Gets the positional posting at position index.
         * @param index Position of the positional posting.
         * @return The positional posting at position index.
         */
        get(index) {
            return this.postings[index];
        }
        /**
         * Returns simple union of two positional postings list p1 and p2. The algorithm assumes the intersection of two
         * positional postings list is empty, therefore the union is just concatenation of two positional postings lists.
         * @param secondList p2
         * @return Union of two positional postings lists.
         */
        union(secondList) {
            let result = new PositionalPostingList();
            result.postings = result.postings.concat(this.postings);
            result.postings = result.postings.concat(secondList.postings);
            return result;
        }
        /**
         * Algorithm for the intersection of two positional postings lists p1 and p2. We maintain pointers into both lists
         * and walk through the two positional postings lists simultaneously, in time linear in the total number of postings
         * entries. At each step, we compare the docID pointed to by both pointers. If they are not the same, we advance the
         * pointer pointing to the smaller docID. Otherwise, we advance both pointers and do the same intersection search on
         * the positional lists of two documents. Similarly, we compare the positions pointed to by both position pointers.
         * If they are successive, we add the position to the result and advance both position pointers. Otherwise, we
         * advance the pointer pointing to the smaller position.
         * @param secondList p2, second posting list.
         * @return Intersection of two postings lists p1 and p2.
         */
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
        /**
         * Prints this object into a file with the given index.
         * @param index Position of this positional posting list in the inverted index.
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
         * Converts the positional posting list to a string. String is of the form all postings separated via space.
         * @return String form of the positional posting list.
         */
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