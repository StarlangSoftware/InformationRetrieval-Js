(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./QueryResultItem"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QueryResult = void 0;
    const QueryResultItem_1 = require("./QueryResultItem");
    class QueryResult {
        constructor() {
            this.items = new Array();
            this.queryResultItemComparator = (resultA, resultB) => (resultA.getScore() > resultB.getScore() ? -1 :
                (resultA.getScore() < resultB.getScore() ? 1 : 0));
        }
        add(docId, score = 0.0) {
            this.items.push(new QueryResultItem_1.QueryResultItem(docId, score));
        }
        getItems() {
            return this.items;
        }
        sort() {
            this.items.sort(this.queryResultItemComparator);
        }
    }
    exports.QueryResult = QueryResult;
});
//# sourceMappingURL=QueryResult.js.map