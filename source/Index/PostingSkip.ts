import {Posting} from "./Posting";

export class PostingSkip extends Posting{

    private skipAvailable: boolean = false
    private skip: PostingSkip = null
    private next: PostingSkip = null

    /**
     * Constructor for the PostingSkip class. Sets the document id.
     * @param id Document id.
     */
    constructor(id: number) {
        super(id);
    }

    /**
     * Checks if this posting has a skip pointer or not.
     * @return True, if this posting has a skip pointer, false otherwise.
     */
    hasSkip(): boolean{
        return this.skipAvailable
    }

    /**
     * Adds a skip pointer to the next skip posting.
     * @param skip Next posting to jump.
     */
    addSkip(skip: PostingSkip){
        this.skipAvailable = true
        this.skip = skip
    }

    /**
     * Updated the skip pointer.
     * @param next New skip pointer
     */
    setNext(next: PostingSkip){
        this.next = next
    }

    /**
     * Accessor for the skip pointer.
     * @return Next posting to skip.
     */
    getNext(): PostingSkip{
        return this.next
    }

    /**
     * Accessor for the skip.
     * @return Skip
     */
    getSkip(): PostingSkip{
        return this.skip
    }

}