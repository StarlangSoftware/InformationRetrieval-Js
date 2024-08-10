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
        /**
         * Empty constructor for the QueryResult object.
         */
        constructor() {
            this.items = new Array();
        }
        /**
         * Adds a new result item to the list of query result.
         * @param docId Document id of the result
         * @param score Score of the result
         */
        add(docId, score = 0.0) {
            this.items.push(new QueryResultItem_1.QueryResultItem(docId, score));
        }
        /**
         * Returns number of results for query
         * @return Number of results for query
         */
        size() {
            return this.items.length;
        }
        /**
         * Returns result list for query
         * @return Result list for query
         */
        getItems() {
            return this.items;
        }
        /**
         * Given two query results, this method identifies the intersection of those two results by doing parallel iteration
         * in O(N).
         * @param queryResult Second query result to be intersected.
         * @return Intersection of this query result with the second query result
         */
        intersectionFastSearch(queryResult) {
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
        /**
         * Given two query results, this method identifies the intersection of those two results by doing binary search on
         * the second list in O(N log N).
         * @param queryResult Second query result to be intersected.
         * @return Intersection of this query result with the second query result
         */
        intersectionBinarySearch(queryResult) {
            let result = new QueryResult();
            for (let searchedItem of this.items) {
                let low = 0;
                let high = queryResult.size() - 1;
                let middle = Math.floor((low + high) / 2);
                let found = false;
                while (low <= high) {
                    if (searchedItem.getDocId() > queryResult.items[middle].getDocId()) {
                        low = middle + 1;
                    }
                    else {
                        if (searchedItem.getDocId() < queryResult.items[middle].getDocId()) {
                            high = middle - 1;
                        }
                        else {
                            found = true;
                            break;
                        }
                    }
                    middle = Math.floor((low + high) / 2);
                }
                if (found) {
                    result.add(searchedItem.getDocId(), searchedItem.getScore());
                }
            }
            return result;
        }
        /**
         * Given two query results, this method identifies the intersection of those two results by doing exhaustive search
         * on the second list in O(N^2).
         * @param queryResult Second query result to be intersected.
         * @return Intersection of this query result with the second query result
         */
        intersectionLinearSearch(queryResult) {
            let result = new QueryResult();
            for (let searchedItem of this.items) {
                for (let item of queryResult.items) {
                    if (searchedItem.getDocId() == item.getDocId()) {
                        result.add(searchedItem.getDocId(), searchedItem.getScore());
                    }
                }
            }
            return result;
        }
        /**
         * Compares two query result items according to their scores.
         * @param resultA the first query result item to be compared.
         * @param resultB the second query result item to be compared.
         * @return -1 if the score of the first item is smaller than the score of the second item; 1 if the score of the
         * first item is larger than the score of the second item; 0 otherwise.
         */
        compare(resultA, resultB) {
            if (resultA.getScore() > resultB.getScore()) {
                return 1;
            }
            else {
                if (resultA.getScore() < resultB.getScore()) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        }
        /**
         * The method returns K best results from the query result using min heap in O(K log N + N log K) time.
         * @param K Size of the best subset.
         */
        getBest(K) {
            let minHeap = new MinHeap_1.MinHeap(K, this.compare);
            for (let i = 0; i < K && i < this.items.length; i++) {
                minHeap.insert(this.items[i]);
            }
            for (let i = K + 1; i < this.items.length; i++) {
                let top = minHeap.delete();
                if (this.compare(top, this.items[i]) > 0) {
                    minHeap.insert(top);
                }
                else {
                    minHeap.insert(this.items[i]);
                }
            }
            this.items = [];
            for (let i = 0; i < K && !minHeap.isEmpty(); i++) {
                this.items.unshift(minHeap.delete());
            }
        }
    }
    exports.QueryResult = QueryResult;
});
//# sourceMappingURL=QueryResult.js.map