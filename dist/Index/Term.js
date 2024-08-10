(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-dictionary/dist/Dictionary/Word"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Term = void 0;
    const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
    class Term extends Word_1.Word {
        /**
         * Constructor for the Term class. Sets the fields.
         * @param name Text of the term
         * @param termId Id of the term
         */
        constructor(name, termId) {
            super(name);
            this.termId = termId;
        }
        /**
         * Accessor for the term id attribute.
         * @return Term id attribute
         */
        getTermId() {
            return this.termId;
        }
    }
    exports.Term = Term;
});
//# sourceMappingURL=Term.js.map