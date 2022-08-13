import {QueryResultItem} from "./QueryResultItem";

export class QueryResult {

    private items: Array<QueryResultItem> = new Array<QueryResultItem>()

    constructor() {
    }

    add(docId: number, score: number = 0.0){
        this.items.push(new QueryResultItem(docId, score))
    }

    getItems(): Array<QueryResultItem>{
        return this.items
    }

    queryResultItemComparator = (resultA: QueryResultItem, resultB: QueryResultItem) =>
        (resultA.getScore() > resultB.getScore() ? -1 :
            (resultA.getScore() < resultB.getScore() ? 1 : 0))

    sort(){
        this.items.sort(this.queryResultItemComparator)
    }

}