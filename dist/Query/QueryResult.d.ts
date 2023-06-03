import { QueryResultItem } from "./QueryResultItem";
export declare class QueryResult {
    private items;
    constructor();
    add(docId: number, score?: number): void;
    size(): number;
    getItems(): Array<QueryResultItem>;
    intersectionFastSearch(queryResult: QueryResult): QueryResult;
    intersectionBinarySearch(queryResult: QueryResult): QueryResult;
    intersectionLinearSearch(queryResult: QueryResult): QueryResult;
    compare(resultA: QueryResultItem, resultB: QueryResultItem): number;
    getBest(K: number): void;
}
