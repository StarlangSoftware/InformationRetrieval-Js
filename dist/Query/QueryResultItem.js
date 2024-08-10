(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QueryResultItem = void 0;
    class QueryResultItem {
        /**
         * Constructor for the QueryResultItem class. Sets the document id and score of a single query result.
         * @param docId Id of the document that satisfies the query.
         * @param score Score of the document for the query.
         */
        constructor(docId, score) {
            this.docId = docId;
            this.score = score;
        }
        /**
         * Accessor for the docID attribute.
         * @return docID attribute
         */
        getDocId() {
            return this.docId;
        }
        /**
         * Accessor for the score attribute.
         * @return score attribute.
         */
        getScore() {
            return this.score;
        }
    }
    exports.QueryResultItem = QueryResultItem;
});
//# sourceMappingURL=QueryResultItem.js.map