export declare class QueryResultItem {
    private readonly docId;
    private readonly score;
    constructor(docId: number, score: number);
    getDocId(): number;
    getScore(): number;
}
