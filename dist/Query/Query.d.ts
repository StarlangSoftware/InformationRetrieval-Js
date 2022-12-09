import { Word } from "nlptoolkit-dictionary/dist/Dictionary/Word";
export declare class Query {
    private readonly terms;
    constructor(query?: string);
    getTerm(index: number): Word;
    size(): number;
    filterAttributes(attributeList: Set<string>, termAttributes: Query, phraseAttributes: Query): void;
}
