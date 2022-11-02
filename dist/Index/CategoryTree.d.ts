import { CategoryNode } from "./CategoryNode";
import { TermDictionary } from "./TermDictionary";
export declare class CategoryTree {
    private readonly root;
    constructor(rootName: string);
    addCategoryHierarchy(hierarchy: string): CategoryNode;
    topNString(dictionary: TermDictionary, N: number): string;
}
