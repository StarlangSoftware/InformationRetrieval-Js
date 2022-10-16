import { QueryResultItem } from "./QueryResultItem";
export declare class QueryResult {
    private items;
    constructor();
    add(docId: number, score?: number): void;
    getItems(): Array<QueryResultItem>;
    compare(resultA: QueryResultItem, resultB: QueryResultItem): number;
    getBest(K: number): void;
}
