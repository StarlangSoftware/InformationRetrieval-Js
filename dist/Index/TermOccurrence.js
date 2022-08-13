(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-dictionary/dist/Dictionary/WordComparator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TermOccurrence = void 0;
    const WordComparator_1 = require("nlptoolkit-dictionary/dist/Dictionary/WordComparator");
    class TermOccurrence {
        constructor(term, docId, position) {
            this.wordComparator = (comparator) => (word1, word2) => (comparator == WordComparator_1.WordComparator.TURKISH ?
                word1.getName().localeCompare(word2.getName(), "tr") :
                (comparator == WordComparator_1.WordComparator.TURKISH_IGNORE_CASE ? word1.getName().toLocaleLowerCase("tr").localeCompare(word2.getName().toLocaleLowerCase("tr"), "tr") :
                    word1.getName().localeCompare(word2.getName(), "en")));
            this.term = term;
            this.docId = docId;
            this.position = position;
        }
        getTerm() {
            return this.term;
        }
        getDocId() {
            return this.docId;
        }
        getPosition() {
            return this.position;
        }
        isDifferent(currentTerm, comparator) {
            return this.wordComparator(comparator)(this.term, currentTerm.getTerm()) != 0;
        }
    }
    exports.TermOccurrence = TermOccurrence;
});
//# sourceMappingURL=TermOccurrence.js.map