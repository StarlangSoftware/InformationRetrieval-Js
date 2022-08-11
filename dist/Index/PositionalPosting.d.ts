import { Posting } from "./Posting";
export declare class PositionalPosting {
    private positions;
    private readonly docId;
    constructor(docId: number);
    add(position: number): void;
    getDocId(): number;
    getPositions(): Array<Posting>;
    size(): number;
    toString(): string;
}
