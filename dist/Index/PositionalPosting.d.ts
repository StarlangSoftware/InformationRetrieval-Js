import { Posting } from "./Posting";
export declare class PositionalPosting {
    private positions;
    private readonly docId;
    /**
     * Constructor for the PositionalPosting class. Sets the document id and initializes the position array.
     * @param docId document id of the posting.
     */
    constructor(docId: number);
    /**
     * Adds a position to the position list.
     * @param position Position added to the position list.
     */
    add(position: number): void;
    /**
     * Accessor for the document id attribute.
     * @return Document id.
     */
    getDocId(): number;
    /**
     * Accessor for the positions attribute.
     * @return Position list.
     */
    getPositions(): Array<Posting>;
    /**
     * Returns size of the position list.
     * @return Size of the position list.
     */
    size(): number;
    /**
     * Converts the positional posting to a string. String is of the form, document id, number of positions, and all
     * positions separated via space.
     * @return String form of the positional posting.
     */
    toString(): string;
}
