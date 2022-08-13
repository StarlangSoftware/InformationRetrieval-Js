import {Posting} from "./Posting";
import {QueryResult} from "../Query/QueryResult";

export class PostingList {

    postings: Array<Posting> = new Array<Posting>()

    constructor(line?: string) {
        if (line != undefined){
            let ids = line.split(" ")
            for (let id of ids){
                this.add(parseInt(id))
            }
        }
    }

    add(docId: number){
        this.postings.push(new Posting(docId))
    }

    size(): number{
        return this.postings.length
    }

    intersection(secondList: PostingList): PostingList{
        let i = 0, j = 0
        let result = new PostingList()
        while (i < this.size() && j < secondList.size()){
            let p1 = this.postings[i]
            let p2 = secondList.postings[j]
            if (p1.getId() == p2.getId()){
                result.add(p1.getId())
                i++
                j++
            } else {
                if (p1.getId() < p2.getId()){
                    i++
                } else {
                    j++
                }
            }
        }
        return result
    }

    union(secondList: PostingList): PostingList{
        let result = new PostingList()
        result.postings.concat(this.postings)
        result.postings.concat(secondList.postings)
        return result
    }

    toQueryResult(): QueryResult{
        let result = new QueryResult()
        for (let posting of this.postings){
            result.add(posting.getId())
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
        for (let posting of this.postings){
            result = result + posting.getId().toString() + " "
        }
        return result.trim() + "\n"
    }
}