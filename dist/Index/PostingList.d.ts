import { Posting } from "./Posting";
import { QueryResult } from "../Query/QueryResult";
export declare class PostingList {
    postings: Array<Posting>;
    constructor(line?: string);
    add(docId: number): void;
    size(): number;
    intersection(secondList: PostingList): PostingList;
    union(secondList: PostingList): PostingList;
    toQueryResult(): QueryResult;
    writeToFile(index: number): string;
    toString(): string;
}
