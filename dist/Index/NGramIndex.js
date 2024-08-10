(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./InvertedIndex"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NGramIndex = void 0;
    const InvertedIndex_1 = require("./InvertedIndex");
    class NGramIndex extends InvertedIndex_1.InvertedIndex {
        /**
         * Constructs an NGram index from a list of sorted tokens. The terms array should be sorted before calling this
         * method. Calls the constructor for the InvertedIndex.
         * @param dictionaryOrFileName Term dictionary
         * @param terms Sorted list of tokens in the memory collection.
         * @param comparator Comparator method to compare two terms.
         */
        constructor(dictionaryOrFileName, terms, comparator) {
            super(dictionaryOrFileName, terms, comparator);
        }
    }
    exports.NGramIndex = NGramIndex;
});
//# sourceMappingURL=NGramIndex.js.map