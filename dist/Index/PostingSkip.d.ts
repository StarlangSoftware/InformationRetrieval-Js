import { Posting } from "./Posting";
export declare class PostingSkip extends Posting {
    private skipAvailable;
    private skip;
    private next;
    /**
     * Constructor for the PostingSkip class. Sets the document id.
     * @param id Document id.
     */
    constructor(id: number);
    /**
     * Checks if this posting has a skip pointer or not.
     * @return True, if this posting has a skip pointer, false otherwise.
     */
    hasSkip(): boolean;
    /**
     * Adds a skip pointer to the next skip posting.
     * @param skip Next posting to jump.
     */
    addSkip(skip: PostingSkip): void;
    /**
     * Updated the skip pointer.
     * @param next New skip pointer
     */
    setNext(next: PostingSkip): void;
    /**
     * Accessor for the skip pointer.
     * @return Next posting to skip.
     */
    getNext(): PostingSkip;
    /**
     * Accessor for the skip.
     * @return Skip
     */
    getSkip(): PostingSkip;
}
