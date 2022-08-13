import { PostingList } from "./PostingList";
export declare class PostingSkipList extends PostingList {
    private skipped;
    constructor();
    add(docId: number): void;
    addSkipPointers(): void;
    intersection(secondList: PostingSkipList): PostingSkipList;
}
