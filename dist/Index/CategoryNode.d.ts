import { TermDictionary } from "./TermDictionary";
export declare class CategoryNode {
    private readonly name;
    private children;
    private readonly parent;
    private counts;
    constructor(name: string, parent: CategoryNode);
    private addChild;
    getName(): string;
    getChild(childName: string): CategoryNode;
    addCounts(termId: number, count: number): void;
    getChildren(): Array<CategoryNode>;
    topN(N: number): Array<[number, number]>;
    topNString(dictionary: TermDictionary, N: number): string;
    toString(): string;
}
