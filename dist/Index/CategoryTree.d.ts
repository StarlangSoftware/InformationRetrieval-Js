import { CategoryNode } from "./CategoryNode";
import { Query } from "../Query/Query";
import { TermDictionary } from "./TermDictionary";
import { CategoryDeterminationType } from "../Query/CategoryDeterminationType";
export declare class CategoryTree {
    private readonly root;
    constructor(rootName: string);
    addCategoryHierarchy(hierarchy: string): CategoryNode;
    getCategories(query: Query, dictionary: TermDictionary, categoryDeterminationType: CategoryDeterminationType): Array<CategoryNode>;
    setRepresentativeCount(representativeCount: number): void;
}
