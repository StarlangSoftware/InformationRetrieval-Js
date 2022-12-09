import { QueryResultItem } from "./QueryResultItem";
export declare class QueryResult {
    private items;
    constructor();
    add(docId: number, score?: number): void;
    size(): number;
    getItems(): Array<QueryResultItem>;
    intersection(queryResult: QueryResult): QueryResult;
    compare(resultA: QueryResultItem, resultB: QueryResultItem): number;
    getBest(K: number): void;
}
