import {Posting} from "./Posting";

export class PositionalPosting {

    private positions: Array<Posting> = new Array<Posting>()
    private readonly docId: number

    /**
     * Constructor for the PositionalPosting class. Sets the document id and initializes the position array.
     * @param docId document id of the posting.
     */
    constructor(docId: number) {
        this.docId = docId
    }

    /**
     * Adds a position to the position list.
     * @param position Position added to the position list.
     */
    add(position: number){
        this.positions.push(new Posting(position))
    }

    /**
     * Accessor for the document id attribute.
     * @return Document id.
     */
    getDocId(): number{
        return this.docId
    }

    /**
     * Accessor for the positions attribute.
     * @return Position list.
     */
    getPositions(): Array<Posting>{
        return this.positions
    }

    /**
     * Returns size of the position list.
     * @return Size of the position list.
     */
    size(): number{
        return this.positions.length
    }

    /**
     * Converts the positional posting to a string. String is of the form, document id, number of positions, and all
     * positions separated via space.
     * @return String form of the positional posting.
     */
    toString(): string{
        let result = this.docId + " " + this.positions.length
        for (let posting of this.positions){
            result = result + " " + posting.getId()
        }
        return result
    }


}