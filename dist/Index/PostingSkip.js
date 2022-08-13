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
        constructor(id) {
            super(id);
            this.skipAvailable = false;
            this.skip = null;
            this.next = null;
        }
        hasSkip() {
            return this.skipAvailable;
        }
        addSkip(skip) {
            this.skipAvailable = true;
            this.skip = skip;
        }
        setNext(next) {
            this.next = next;
        }
        getNext() {
            return this.next;
        }
        getSkip() {
            return this.skip;
        }
    }
    exports.PostingSkip = PostingSkip;
});
//# sourceMappingURL=PostingSkip.js.map