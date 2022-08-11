import {Posting} from "./Posting";

export class PositionalPosting {

    private positions: Array<Posting> = new Array<Posting>()
    private readonly docId: number

    constructor(docId: number) {
        this.docId = docId
    }

    add(position: number){
        this.positions.push(new Posting(position))
    }

    getDocId(): number{
        return this.docId
    }

    getPositions(): Array<Posting>{
        return this.positions
    }

    size(): number{
        return this.positions.length
    }

    toString(): string{
        let result = this.docId + " " + this.positions.length
        for (let posting of this.positions){
            result = result + " " + posting.getId()
        }
        return result
    }


}