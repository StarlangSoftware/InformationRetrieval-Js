import {QueryResultItem} from "./QueryResultItem";
import {MinHeap} from "nlptoolkit-datastructure/dist/heap/MinHeap";

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

    compare(resultA: QueryResultItem, resultB: QueryResultItem): number {
        if (resultA.getScore() > resultB.getScore()){
            return -1
        } else {
            if (resultA.getScore() < resultB.getScore()){
                return 1
            } else {
                return 0
            }
        }
    }

    getBest(K: number){
        let minHeap: MinHeap<QueryResultItem> = new MinHeap<QueryResultItem>(2 * K, this.compare);
        for (const queryResultItem of this.items){
            minHeap.insert(queryResultItem)
        }
        this.items = []
        for (let i = 0; i < K && !minHeap.isEmpty(); i++){
            this.items.push(minHeap.delete())
        }
    }

}