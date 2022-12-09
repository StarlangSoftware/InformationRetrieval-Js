import {CategoryNode} from "./CategoryNode";
import {Query} from "../Query/Query";
import {TermDictionary} from "./TermDictionary";
import {CategoryDeterminationType} from "../Query/CategoryDeterminationType";

export class CategoryTree {

    private readonly root: CategoryNode

    constructor(rootName: string) {
        this.root = new CategoryNode(rootName, null)
    }

    public addCategoryHierarchy(hierarchy: string): CategoryNode {
        let categories = hierarchy.split("%")
        let current = this.root
        for (let category of categories) {
            let node = current.getChild(category)
            if (node == null) {
                node = new CategoryNode(category, current)
            }
            current = node
        }
        return current
    }

    public getCategories(query: Query, dictionary: TermDictionary, categoryDeterminationType: CategoryDeterminationType): Array<CategoryNode> {
        let result = new Array<CategoryNode>()
        switch (categoryDeterminationType) {
            case CategoryDeterminationType.KEYWORD:
                this.root.getCategoriesWithKeyword(query, result)
                break
            case CategoryDeterminationType.COSINE:
                this.root.getCategoriesWithCosine(query, dictionary, result)
                break
        }
        return result
    }

    public setRepresentativeCount(representativeCount: number) {
        this.root.setRepresentativeCount(representativeCount)
    }

}