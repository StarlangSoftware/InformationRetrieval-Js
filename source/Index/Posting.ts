export class Posting{

    private readonly id: number

    /**
     * Constructor for the Posting class. Sets the document id attribute.
     * @param id Document id.
     */
    constructor(id: number) {
        this.id = id
    }

    /**
     * Accessor for the document id attribute.
     * @return Document id.
     */
    getId(): number{
        return this.id
    }
}