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
        size() {
            return this.items.length;
        }
        getItems() {
            return this.items;
        }
        intersection(queryResult) {
            let result = new QueryResult();
            let i = 0, j = 0;
            while (i < this.size() && j < queryResult.size()) {
                let item1 = this.items[i];
                let item2 = queryResult.items[j];
                if (item1.getDocId() == item2.getDocId()) {
                    result.add(item1.getDocId());
                    i++;
                    j++;
                }
                else {
                    if (item1.getDocId() < item2.getDocId()) {
                        i++;
                    }
                    else {
                        j++;
                    }
                }
            }
            return result;
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