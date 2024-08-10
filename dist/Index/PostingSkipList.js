(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./PostingSkip", "./PostingList"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostingSkipList = void 0;
    const PostingSkip_1 = require("./PostingSkip");
    const PostingList_1 = require("./PostingList");
    class PostingSkipList extends PostingList_1.PostingList {
        /**
         * Constructor for the PostingSkipList class.
         */
        constructor() {
            super();
            this.skipped = false;
        }
        /**
         * Adds a new posting (document id) to the posting skip list.
         * @param docId New document id to be added to the posting skip list.
         */
        add(docId) {
            let p = new PostingSkip_1.PostingSkip(docId);
            let previous = this.postings[this.postings.length - 1];
            previous.setNext(p);
            this.postings.push(p);
        }
        /**
         * Augments postings lists with skip pointers. Skip pointers are effectively shortcuts that allow us to avoid
         * processing parts of the postings list that will not figure in the search results. We follow a simple heuristic
         * for placing skips, which has been found to work well in practice, is that for a postings list of length P, use
         * square root of P evenly-spaced skip pointers.
         */
        addSkipPointers() {
            let i, j, N = Math.sqrt(this.size());
            if (!this.skipped) {
                this.skipped = true;
                for (let i = 0, posting = 0; posting != this.postings.length; posting++, i++) {
                    if (i % N == 0 && i + N < this.size()) {
                        let skip = posting;
                        for (let j = 0; j < N; skip++) {
                            j++;
                        }
                        this.postings[posting].addSkip(this.postings[skip]);
                    }
                }
            }
        }
        /**
         * Algorithm for the intersection of two postings skip lists p1 and p2. We maintain pointers into both lists and
         * walk through the two postings lists simultaneously, in time linear in the total number of postings entries. At
         * each step, we compare the docID pointed to by both pointers. If they are the same, we put that docID in the
         * results list, and advance both pointers. Otherwise, we advance the pointer pointing to the smaller docID or use
         * skip pointers to skip as many postings as possible.
         * @param secondList p2, second posting list.
         * @return Intersection of two postings lists p1 and p2.
         */
        intersection(secondList) {
            let p1 = this.postings[0];
            let p2 = secondList.postings[0];
            let result = new PostingSkipList();
            while (p1 != null && p2 != null) {
                if (p1.getId() == p2.getId()) {
                    result.add(p1.getId());
                    p1 = p1.getNext();
                    p2 = p2.getNext();
                }
                else {
                    if (p1.getId() < p2.getId()) {
                        if (this.skipped && p1.hasSkip() && p1.getSkip().getId() < p2.getId()) {
                            while (p1.hasSkip() && p1.getSkip().getId() < p2.getId()) {
                                p1 = p1.getSkip();
                            }
                        }
                        else {
                            p1 = p1.getNext();
                        }
                    }
                    else {
                        if (this.skipped && p2.hasSkip() && p2.getSkip().getId() < p1.getId()) {
                            while (p2.hasSkip() && p2.getSkip().getId() < p1.getId()) {
                                p2 = p2.getSkip();
                            }
                        }
                        else {
                            p2 = p2.getNext();
                        }
                    }
                }
            }
            return result;
        }
    }
    exports.PostingSkipList = PostingSkipList;
});
//# sourceMappingURL=PostingSkipList.js.map