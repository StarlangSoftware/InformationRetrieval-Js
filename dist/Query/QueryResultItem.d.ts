export declare class QueryResultItem {
    private readonly docId;
    private readonly score;
    /**
     * Constructor for the QueryResultItem class. Sets the document id and score of a single query result.
     * @param docId Id of the document that satisfies the query.
     * @param score Score of the document for the query.
     */
    constructor(docId: number, score: number);
    /**
     * Accessor for the docID attribute.
     * @return docID attribute
     */
    getDocId(): number;
    /**
     * Accessor for the score attribute.
     * @return score attribute.
     */
    getScore(): number;
}
