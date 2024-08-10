(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Posting"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostingSkip = void 0;
    const Posting_1 = require("./Posting");
    class PostingSkip extends Posting_1.Posting {
        /**
         * Constructor for the PostingSkip class. Sets the document id.
         * @param id Document id.
         */
        constructor(id) {
            super(id);
            this.skipAvailable = false;
            this.skip = null;
            this.next = null;
        }
        /**
         * Checks if this posting has a skip pointer or not.
         * @return True, if this posting has a skip pointer, false otherwise.
         */
        hasSkip() {
            return this.skipAvailable;
        }
        /**
         * Adds a skip pointer to the next skip posting.
         * @param skip Next posting to jump.
         */
        addSkip(skip) {
            this.skipAvailable = true;
            this.skip = skip;
        }
        /**
         * Updated the skip pointer.
         * @param next New skip pointer
         */
        setNext(next) {
            this.next = next;
        }
        /**
         * Accessor for the skip pointer.
         * @return Next posting to skip.
         */
        getNext() {
            return this.next;
        }
        /**
         * Accessor for the skip.
         * @return Skip
         */
        getSkip() {
            return this.skip;
        }
    }
    exports.PostingSkip = PostingSkip;
});
//# sourceMappingURL=PostingSkip.js.map