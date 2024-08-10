import { PostingList } from "./PostingList";
export declare class PostingSkipList extends PostingList {
    private skipped;
    /**
     * Constructor for the PostingSkipList class.
     */
    constructor();
    /**
     * Adds a new posting (document id) to the posting skip list.
     * @param docId New document id to be added to the posting skip list.
     */
    add(docId: number): void;
    /**
     * Augments postings lists with skip pointers. Skip pointers are effectively shortcuts that allow us to avoid
     * processing parts of the postings list that will not figure in the search results. We follow a simple heuristic
     * for placing skips, which has been found to work well in practice, is that for a postings list of length P, use
     * square root of P evenly-spaced skip pointers.
     */
    addSkipPointers(): void;
    /**
     * Algorithm for the intersection of two postings skip lists p1 and p2. We maintain pointers into both lists and
     * walk through the two postings lists simultaneously, in time linear in the total number of postings entries. At
     * each step, we compare the docID pointed to by both pointers. If they are the same, we put that docID in the
     * results list, and advance both pointers. Otherwise, we advance the pointer pointing to the smaller docID or use
     * skip pointers to skip as many postings as possible.
     * @param secondList p2, second posting list.
     * @return Intersection of two postings lists p1 and p2.
     */
    intersection(secondList: PostingSkipList): PostingSkipList;
}
