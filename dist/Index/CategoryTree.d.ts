import { CategoryNode } from "./CategoryNode";
import { Query } from "../Query/Query";
import { TermDictionary } from "./TermDictionary";
import { CategoryDeterminationType } from "../Query/CategoryDeterminationType";
export declare class CategoryTree {
    private readonly root;
    /**
     * Simple constructor of the tree. Sets the root node of the tree.
     * @param rootName Category name of the root node.
     */
    constructor(rootName: string);
    /**
     * Adds a path (and if required nodes in the path) to the category tree according to the hierarchy string. Hierarchy
     * string is obtained by concatenating the names of all nodes in the path from root node to a leaf node separated
     * with '%'.
     * @param hierarchy Hierarchy string
     * @return The leaf node added when the hierarchy string is processed.
     */
    addCategoryHierarchy(hierarchy: string): CategoryNode;
    /**
     * The method checks the query words in the category words of all nodes in the tree and returns the nodes that
     * satisfies the condition. If any word in the query appears in any category word, the node will be returned.
     * @param query Query string
     * @param dictionary Term dictionary
     * @param categoryDeterminationType Category determination type
     * @return The category nodes whose names contain at least one word from the query string
     */
    getCategories(query: Query, dictionary: TermDictionary, categoryDeterminationType: CategoryDeterminationType): Array<CategoryNode>;
    /**
     * The method sets the representative count. The representative count filters the most N frequent words.
     * @param representativeCount Number of representatives.
     */
    setRepresentativeCount(representativeCount: number): void;
}
