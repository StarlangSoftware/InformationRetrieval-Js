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

    intersectionFastSearch(queryResult: QueryResult): QueryResult{
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

    intersectionBinarySearch(queryResult: QueryResult): QueryResult{
        let result = new QueryResult()
        for (let searchedItem of this.items){
            let low = 0
            let high = queryResult.size() - 1
            let middle = (low + high) / 2
            let found = false
            while (low <= high){
                if (searchedItem.getDocId() > queryResult.items[middle].getDocId()){
                    low = middle + 1
                } else {
                    if (searchedItem.getDocId() < queryResult.items[middle].getDocId()){
                        high = middle - 1
                    } else {
                        found = true
                        break
                    }
                }
                middle = (low + high) / 2
            }
            if (found){
                result.add(searchedItem.getDocId(), searchedItem.getScore())
            }
        }
        return result;
    }

    intersectionLinearSearch(queryResult: QueryResult): QueryResult{
        let result = new QueryResult()
        for (let searchedItem of this.items){
            for (let item of queryResult.items){
                if (searchedItem.getDocId() == item.getDocId()){
                    result.add(searchedItem.getDocId(), searchedItem.getScore())
                }
            }
        }
        return result
    }

    compare(resultA: QueryResultItem, resultB: QueryResultItem): number {
        if (resultA.getScore() > resultB.getScore()){
            return 1
        } else {
            if (resultA.getScore() < resultB.getScore()){
                return -1
            } else {
                return 0
            }
        }
    }

    getBest(K: number){
        let minHeap: MinHeap<QueryResultItem> = new MinHeap<QueryResultItem>(K, this.compare);
        for (let i = 0; i < K && i < this.items.length; i++){
            minHeap.insert(this.items[i])
        }
        for (let i = K + 1; i < this.items.length; i++){
            let top = minHeap.delete();
            if (this.compare(top, this.items[i]) > 0){
                minHeap.insert(top);
            } else {
                minHeap.insert(this.items[i]);
            }
        }
        this.items = []
        for (let i = 0; i < K && !minHeap.isEmpty(); i++){
            this.items.unshift(minHeap.delete())
        }
    }

}