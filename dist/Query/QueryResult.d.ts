import { QueryResultItem } from "./QueryResultItem";
export declare class QueryResult {
    private items;
    /**
     * Empty constructor for the QueryResult object.
     */
    constructor();
    /**
     * Adds a new result item to the list of query result.
     * @param docId Document id of the result
     * @param score Score of the result
     */
    add(docId: number, score?: number): void;
    /**
     * Returns number of results for query
     * @return Number of results for query
     */
    size(): number;
    /**
     * Returns result list for query
     * @return Result list for query
     */
    getItems(): Array<QueryResultItem>;
    /**
     * Given two query results, this method identifies the intersection of those two results by doing parallel iteration
     * in O(N).
     * @param queryResult Second query result to be intersected.
     * @return Intersection of this query result with the second query result
     */
    intersectionFastSearch(queryResult: QueryResult): QueryResult;
    /**
     * Given two query results, this method identifies the intersection of those two results by doing binary search on
     * the second list in O(N log N).
     * @param queryResult Second query result to be intersected.
     * @return Intersection of this query result with the second query result
     */
    intersectionBinarySearch(queryResult: QueryResult): QueryResult;
    /**
     * Given two query results, this method identifies the intersection of those two results by doing exhaustive search
     * on the second list in O(N^2).
     * @param queryResult Second query result to be intersected.
     * @return Intersection of this query result with the second query result
     */
    intersectionLinearSearch(queryResult: QueryResult): QueryResult;
    /**
     * Compares two query result items according to their scores.
     * @param resultA the first query result item to be compared.
     * @param resultB the second query result item to be compared.
     * @return -1 if the score of the first item is smaller than the score of the second item; 1 if the score of the
     * first item is larger than the score of the second item; 0 otherwise.
     */
    compare(resultA: QueryResultItem, resultB: QueryResultItem): number;
    /**
     * The method returns K best results from the query result using min heap in O(K log N + N log K) time.
     * @param K Size of the best subset.
     */
    getBest(K: number): void;
}
