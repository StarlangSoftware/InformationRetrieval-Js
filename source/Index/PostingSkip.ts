import {Posting} from "./Posting";

export class PostingSkip extends Posting{

    private skipAvailable: boolean = false
    private skip: PostingSkip = null
    private next: PostingSkip = null

    constructor(id: number) {
        super(id);
    }

    hasSkip(): boolean{
        return this.skipAvailable
    }

    addSkip(skip: PostingSkip){
        this.skipAvailable = true
        this.skip = skip
    }

    setNext(next: PostingSkip){
        this.next = next
    }

    getNext(): PostingSkip{
        return this.next
    }

    getSkip(): PostingSkip{
        return this.skip
    }

}