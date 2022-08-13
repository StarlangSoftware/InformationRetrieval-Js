import {PositionalPosting} from "./PositionalPosting";
import {QueryResult} from "../Query/QueryResult";

export class PositionalPostingList {

    private postings: Array<PositionalPosting> = new Array<PositionalPosting>()

    constructor(lines: Array<string> = undefined) {
        if (lines != undefined){
            for (let line of lines){
                let ids = line.trim().split(" ")
                let numberOfPositionalPostings = parseInt(ids[1])
                let docId = parseInt(ids[0])
                for (let j = 0; j < numberOfPositionalPostings; j++){
                    let positionalPosting = parseInt(ids[j + 2])
                    this.add(docId, positionalPosting)
                }
            }
        }
    }

    size(): number{
        return this.postings.length
    }

    getIndex(docId: number): number{
        let begin = 0, end = this.size() - 1
        while (begin <= end){
            let middle = Math.floor((begin + end) / 2)
            if (docId == this.postings[middle].getDocId()){
                return middle
            } else {
                if (docId < this.postings[middle].getDocId()){
                    end = middle - 1
                } else {
                    begin = middle + 1
                }
            }
        }
        return -1
    }

    toQueryResult(): QueryResult{
        let result = new QueryResult()
        for (let posting of this.postings){
            result.add(posting.getDocId())
        }
        return result
    }

    add(docId: number, position: number){
        let index = this.getIndex(docId)
        if (index == -1){
            this.postings.push(new PositionalPosting(docId))
            this.postings[this.postings.length - 1].add(position)
        } else {
            this.postings[index].add(position)
        }
    }

    get(index: number): PositionalPosting{
        return this.postings[index]
    }

    union(secondList: PositionalPostingList): PositionalPostingList{
        let result = new PositionalPostingList()
        result.postings.concat(this.postings)
        result.postings.concat(secondList.postings)
        return result
    }

    intersection(secondList: PositionalPostingList): PositionalPostingList{
        let i = 0, j = 0
        let result = new PositionalPostingList()
        while (i < this.postings.length && j < secondList.postings.length){
            let p1 = this.postings[i]
            let p2 = secondList.postings[j]
            if (p1.getDocId() == p2.getDocId()){
                let position1 = 0
                let position2 = 0
                let postings1 = p1.getPositions()
                let postings2 = p2.getPositions()
                while (position1 < postings1.length && position2 < postings2.length){
                    if (postings1[position1].getId() + 1 == postings2[position2].getId()){
                        result.add(p1.getDocId(), postings2[position2].getId())
                        position1++
                        position2++
                    } else {
                        if (postings1[position1].getId() + 1 < postings2[position2].getId()){
                            position1++
                        } else {
                            position2++
                        }
                    }
                }
                i++
                j++
            } else {
                if (p1.getDocId() < p2.getDocId()){
                    i++
                } else {
                    j++
                }
            }
        }
        return result
    }

    writeToFile(index: number): string{
        let result = ""
        if (this.size() > 0){
            result = result + index.toString() + " " + this.size().toString() + "\n"
            result = result + this.toString()
        }
        return result
    }

    toString(): string{
        let result = ""
        for (let positionalPosting of this.postings){
            result = result + "\t" + positionalPosting.toString() + "\n"
        }
        return result
    }

}