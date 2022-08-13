import { PositionalPosting } from "./PositionalPosting";
import { QueryResult } from "../Query/QueryResult";
export declare class PositionalPostingList {
    private postings;
    constructor(lines?: Array<string>);
    size(): number;
    getIndex(docId: number): number;
    toQueryResult(): QueryResult;
    add(docId: number, position: number): void;
    get(index: number): PositionalPosting;
    union(secondList: PositionalPostingList): PositionalPostingList;
    intersection(secondList: PositionalPostingList): PositionalPostingList;
    writeToFile(index: number): string;
    toString(): string;
}
