import { TermDictionary } from "./TermDictionary";
import { Query } from "../Query/Query";
export declare class CategoryNode {
    private children;
    private readonly parent;
    private counts;
    private categoryWords;
    constructor(name: string, parent: CategoryNode);
    private addChild;
    getName(): string;
    getChild(childName: string): CategoryNode;
    addCounts(termId: number, count: number): void;
    isDescendant(ancestor: CategoryNode): boolean;
    getChildren(): Array<CategoryNode>;
    toString(): string;
    setRepresentativeCount(representativeCount: number): void;
    getCategoriesWithKeyword(query: Query, result: Array<CategoryNode>): void;
    getCategoriesWithCosine(query: Query, dictionary: TermDictionary, result: Array<CategoryNode>): void;
}
