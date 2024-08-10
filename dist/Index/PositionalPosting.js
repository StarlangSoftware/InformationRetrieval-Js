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
    exports.PositionalPosting = void 0;
    const Posting_1 = require("./Posting");
    class PositionalPosting {
        /**
         * Constructor for the PositionalPosting class. Sets the document id and initializes the position array.
         * @param docId document id of the posting.
         */
        constructor(docId) {
            this.positions = new Array();
            this.docId = docId;
        }
        /**
         * Adds a position to the position list.
         * @param position Position added to the position list.
         */
        add(position) {
            this.positions.push(new Posting_1.Posting(position));
        }
        /**
         * Accessor for the document id attribute.
         * @return Document id.
         */
        getDocId() {
            return this.docId;
        }
        /**
         * Accessor for the positions attribute.
         * @return Position list.
         */
        getPositions() {
            return this.positions;
        }
        /**
         * Returns size of the position list.
         * @return Size of the position list.
         */
        size() {
            return this.positions.length;
        }
        /**
         * Converts the positional posting to a string. String is of the form, document id, number of positions, and all
         * positions separated via space.
         * @return String form of the positional posting.
         */
        toString() {
            let result = this.docId + " " + this.positions.length;
            for (let posting of this.positions) {
                result = result + " " + posting.getId();
            }
            return result;
        }
    }
    exports.PositionalPosting = PositionalPosting;
});
//# sourceMappingURL=PositionalPosting.js.map