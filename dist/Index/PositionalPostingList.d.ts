import { PositionalPosting } from "./PositionalPosting";
import { QueryResult } from "../Query/QueryResult";
export declare class PositionalPostingList {
    private postings;
    /**
     * Reads a positional posting list from a file. Reads N lines, where each line stores a positional posting. The
     * first item in the line shows document id. The second item in the line shows the number of positional postings.
     * Other items show the positional postings.
     * @param lines Lines read from the input file.
     */
    constructor(lines?: Array<string>);
    /**
     * Returns the number of positional postings in the posting list.
     * @return Number of positional postings in the posting list.
     */
    size(): number;
    /**
     * Does a binary search on the positional postings list for a specific document id.
     * @param docId Document id to be searched.
     * @return The position of the document id in the positional posting list. If it does not exist, the method returns
     * -1.
     */
    getIndex(docId: number): number;
    /**
     * Converts the positional postings list to a query result object. Simply adds all positional postings one by one
     * to the result.
     * @return QueryResult object containing the positional postings in this object.
     */
    toQueryResult(): QueryResult;
    /**
     * Adds a new positional posting (document id and position) to the posting list.
     * @param docId New document id to be added to the positional posting list.
     * @param position New position to be added to the positional posting list.
     */
    add(docId: number, position: number): void;
    /**
     * Gets the positional posting at position index.
     * @param index Position of the positional posting.
     * @return The positional posting at position index.
     */
    get(index: number): PositionalPosting;
    /**
     * Returns simple union of two positional postings list p1 and p2. The algorithm assumes the intersection of two
     * positional postings list is empty, therefore the union is just concatenation of two positional postings lists.
     * @param secondList p2
     * @return Union of two positional postings lists.
     */
    union(secondList: PositionalPostingList): PositionalPostingList;
    /**
     * Algorithm for the intersection of two positional postings lists p1 and p2. We maintain pointers into both lists
     * and walk through the two positional postings lists simultaneously, in time linear in the total number of postings
     * entries. At each step, we compare the docID pointed to by both pointers. If they are not the same, we advance the
     * pointer pointing to the smaller docID. Otherwise, we advance both pointers and do the same intersection search on
     * the positional lists of two documents. Similarly, we compare the positions pointed to by both position pointers.
     * If they are successive, we add the position to the result and advance both position pointers. Otherwise, we
     * advance the pointer pointing to the smaller position.
     * @param secondList p2, second posting list.
     * @return Intersection of two postings lists p1 and p2.
     */
    intersection(secondList: PositionalPostingList): PositionalPostingList;
    /**
     * Prints this object into a file with the given index.
     * @param index Position of this positional posting list in the inverted index.
     */
    writeToFile(index: number): string;
    /**
     * Converts the positional posting list to a string. String is of the form all postings separated via space.
     * @return String form of the positional posting list.
     */
    toString(): string;
}
