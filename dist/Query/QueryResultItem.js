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
        constructor(docId, score) {
            this.docId = docId;
            this.score = score;
        }
        getId() {
            return this.docId;
        }
        getScore() {
            return this.score;
        }
    }
    exports.QueryResultItem = QueryResultItem;
});
//# sourceMappingURL=QueryResultItem.js.map