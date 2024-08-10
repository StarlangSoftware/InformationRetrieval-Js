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
        /**
         * Constructor for the TermOccurrence class. Sets the attributes.
         * @param term Term for this occurrence.
         * @param docId Document id of the term occurrence.
         * @param position Position of the term in the document for this occurrence.
         */
        constructor(term, docId, position) {
            this.term = term;
            this.docId = docId;
            this.position = position;
        }
        /**
         * Accessor for the term.
         * @return Term
         */
        getTerm() {
            return this.term;
        }
        /**
         * Accessor for the document id.
         * @return Document id.
         */
        getDocId() {
            return this.docId;
        }
        /**
         * Accessor for the position of the term.
         * @return Position of the term.
         */
        getPosition() {
            return this.position;
        }
        /**
         * Checks if the current occurrence is different from the other occurrence.
         * @param currentTerm Term occurrence to be compared.
         * @param comparator Comparator function to compare two terms.
         * @return True, if two terms are different; false if they are the same.
         */
        isDifferent(currentTerm, comparator) {
            return TermOccurrence.wordComparator(comparator)(this.term, currentTerm.getTerm()) != 0;
        }
    }
    exports.TermOccurrence = TermOccurrence;
    TermOccurrence.wordComparator = (comparator) => (word1, word2) => (comparator == WordComparator_1.WordComparator.TURKISH ?
        word1.getName().localeCompare(word2.getName(), "tr") :
        (comparator == WordComparator_1.WordComparator.TURKISH_IGNORE_CASE ? word1.getName().toLocaleLowerCase("tr").localeCompare(word2.getName().toLocaleLowerCase("tr"), "tr") :
            word1.getName().localeCompare(word2.getName(), "en")));
});
//# sourceMappingURL=TermOccurrence.js.map