import { TermDictionary } from "./TermDictionary";
import { Query } from "../Query/Query";
export declare class CategoryNode {
    private children;
    private readonly parent;
    private counts;
    private readonly categoryWords;
    /**
     * Constructor for the category node. Each category is represented as a tree node in the category tree. Category
     * words are constructed by splitting the name of the category w.r.t. space. Sets the parent node and adds this
     * node as a child to parent node.
     * @param name Name of the category.
     * @param parent Parent node of this node.
     */
    constructor(name: string, parent: CategoryNode);
    /**
     * Adds the given child node to this node.
     * @param child New child node
     */
    private addChild;
    /**
     * Constructs the category name from the category words. Basically combines all category words separated with space.
     * @return Category name.
     */
    getName(): string;
    /**
     * Searches the children of this node for a specific category name.
     * @param childName Category name of the child.
     * @return The child with the given category name.
     */
    getChild(childName: string): CategoryNode;
    /**
     * Adds frequency count of the term to the counts hash map of all ascendants of this node.
     * @param termId ID of the occurring term.
     * @param count Frequency of the term.
     */
    addCounts(termId: number, count: number): void;
    /**
     * Checks if the given node is an ancestor of the current node.
     * @param ancestor Node for which ancestor check will be done
     * @return True, if the given node is an ancestor of the current node.
     */
    isDescendant(ancestor: CategoryNode): boolean;
    /**
     * Accessor of the children attribute
     * @return Children of the node
     */
    getChildren(): Array<CategoryNode>;
    /**
     * Recursive method that returns the hierarchy string of the node. Hierarchy string is obtained by concatenating the
     * names of all ancestor nodes separated with '%'.
     * @return Hierarchy string of this node
     */
    toString(): string;
    /**
     * Recursive method that sets the representative count. The representative count filters the most N frequent words.
     * @param representativeCount Number of representatives.
     */
    setRepresentativeCount(representativeCount: number): void;
    /**
     * Recursive method that checks the query words in the category words of all descendants of this node and
     * accumulates the nodes that satisfies the condition. If any word  in the query appears in any category word, the
     * node will be accumulated.
     * @param query Query string
     * @param result Accumulator array
     */
    getCategoriesWithKeyword(query: Query, result: Array<CategoryNode>): void;
    /**
     * Recursive method that checks the query words in the category words of all descendants of this node and
     * accumulates the nodes that satisfies the condition. If any word  in the query appears in any category word, the
     * node will be accumulated.
     * @param query Query string
     * @param dictionary Term dictionary
     * @param result Accumulator array
     */
    getCategoriesWithCosine(query: Query, dictionary: TermDictionary, result: Array<CategoryNode>): void;
}
