export class QueryResultItem {

    private readonly docId: number
    private readonly score: number

    constructor(docId: number, score: number) {
        this.docId = docId
        this.score = score
    }

    getDocId(): number{
        return this.docId
    }

    getScore(): number{
        return this.score
    }

}