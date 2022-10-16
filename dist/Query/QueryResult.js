(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./QueryResultItem", "nlptoolkit-datastructure/dist/heap/MinHeap"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QueryResult = void 0;
    const QueryResultItem_1 = require("./QueryResultItem");
    const MinHeap_1 = require("nlptoolkit-datastructure/dist/heap/MinHeap");
    class QueryResult {
        constructor() {
            this.items = new Array();
        }
        add(docId, score = 0.0) {
            this.items.push(new QueryResultItem_1.QueryResultItem(docId, score));
        }
        getItems() {
            return this.items;
        }
        compare(resultA, resultB) {
            if (resultA.getScore() > resultB.getScore()) {
                return -1;
            }
            else {
                if (resultA.getScore() < resultB.getScore()) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }
        getBest(K) {
            let minHeap = new MinHeap_1.MinHeap(2 * K, this.compare);
            for (const queryResultItem of this.items) {
                minHeap.insert(queryResultItem);
            }
            this.items = [];
            for (let i = 0; i < K && !minHeap.isEmpty(); i++) {
                this.items.push(minHeap.delete());
            }
        }
    }
    exports.QueryResult = QueryResult;
});
//# sourceMappingURL=QueryResult.js.map