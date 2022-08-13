import { Posting } from "./Posting";
export declare class PostingSkip extends Posting {
    private skipAvailable;
    private skip;
    private next;
    constructor(id: number);
    hasSkip(): boolean;
    addSkip(skip: PostingSkip): void;
    setNext(next: PostingSkip): void;
    getNext(): PostingSkip;
    getSkip(): PostingSkip;
}
