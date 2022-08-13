import { Word } from "nlptoolkit-dictionary/dist/Dictionary/Word";
export declare class Term extends Word {
    private readonly termId;
    constructor(name: string, termId: number);
    getTermId(): number;
}
