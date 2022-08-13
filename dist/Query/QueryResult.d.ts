import { QueryResultItem } from "./QueryResultItem";
export declare class QueryResult {
    private items;
    constructor();
    add(docId: number, score?: number): void;
    getItems(): Array<QueryResultItem>;
    queryResultItemComparator: (resultA: QueryResultItem, resultB: QueryResultItem) => 1 | -1 | 0;
    sort(): void;
}
