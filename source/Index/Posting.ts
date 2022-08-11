export class Posting{

    private readonly id: number

    constructor(id: number) {
        this.id = id
    }

    getId(): number{
        return this.id
    }
}