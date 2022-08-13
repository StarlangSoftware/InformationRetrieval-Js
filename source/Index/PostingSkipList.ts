import {PostingSkip} from "./PostingSkip";
import {PostingList} from "./PostingList";

export class PostingSkipList extends PostingList{

    private skipped: boolean = false

    constructor() {
        super()
    }

    add(docId: number){
        let p = new PostingSkip(docId)
        let previous = <PostingSkip>this.postings[this.postings.length - 1]
        previous.setNext(p)
        this.postings.push(p)
    }

    addSkipPointers(){
        let i, j, N = Math.sqrt(this.size())
        if (!this.skipped){
            this.skipped = true
            for (let i = 0, posting = 0; posting != this.postings.length; posting++, i++){
                if (i % N == 0 && i + N < this.size()){
                    let skip = posting
                    for (let j = 0; j < N; skip++){
                        j++
                    }
                    (<PostingSkip>this.postings[posting]).addSkip(<PostingSkip> this.postings[skip])
                }
            }
        }
    }

    intersection(secondList: PostingSkipList): PostingSkipList{
        let p1 = <PostingSkip> this.postings[0]
        let p2 = <PostingSkip> secondList.postings[0]
        let result = new PostingSkipList()
        while (p1 != null && p2 != null){
            if (p1.getId() == p2.getId()){
                result.add(p1.getId())
                p1 = p1.getNext()
                p2 = p2.getNext()
            } else {
                if (p1.getId() < p2.getId()){
                    if (this.skipped && p1.hasSkip() && p1.getSkip().getId() < p2.getId()){
                        while (p1.hasSkip() && p1.getSkip().getId() < p2.getId()){
                            p1 = p1.getSkip()
                        }
                    } else {
                        p1 = p1.getNext()
                    }
                } else {
                    if (this.skipped && p2.hasSkip() && p2.getSkip().getId() < p1.getId()){
                        while (p2.hasSkip() && p2.getSkip().getId() < p1.getId()){
                            p2 = p2.getSkip()
                        }
                    } else {
                        p2 = p2.getNext()
                    }
                }
            }
        }
        return result
    }
}