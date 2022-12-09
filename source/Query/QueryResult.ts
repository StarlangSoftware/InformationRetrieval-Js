import {QueryResultItem} from "./QueryResultItem";
import {MinHeap} from "nlptoolkit-datastructure/dist/heap/MinHeap";

export class QueryResult {

    private items: Array<QueryResultItem> = new Array<QueryResultItem>()

    constructor() {
    }

    add(docId: number, score: number = 0.0){
        this.items.push(new QueryResultItem(docId, score))
    }

    size(): number{
        return this.items.length
    }

    getItems(): Array<QueryResultItem>{
        return this.items
    }

    intersection(queryResult: QueryResult): QueryResult{
        let result = new QueryResult()
        let i = 0, j = 0
        while (i < this.size() && j < queryResult.size()){
            let item1 = this.items[i]
            let item2 = queryResult.items[j]
            if (item1.getDocId() == item2.getDocId()){
                result.add(item1.getDocId())
                i++
                j++
            } else {
                if (item1.getDocId() < item2.getDocId()){
                    i++
                } else {
                    j++
                }
            }
        }
        return result
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