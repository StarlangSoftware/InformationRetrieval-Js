"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Term = void 0;
const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
class Term extends Word_1.Word {
    termId;
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
//# sourceMappingURL=Term.js.map