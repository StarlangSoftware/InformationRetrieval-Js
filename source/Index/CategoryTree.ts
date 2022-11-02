import {CategoryNode} from "./CategoryNode";
import {TermDictionary} from "./TermDictionary";

export class CategoryTree {

    private readonly root: CategoryNode

    constructor(rootName: string) {
        this.root = new CategoryNode(rootName, null)
    }

    public addCategoryHierarchy(hierarchy: string): CategoryNode{
        let categories = hierarchy.split("%")
        let current = this.root
        for (let category of categories){
            let node = current.getChild(category)
            if (node == null){
                node = new CategoryNode(category, current)
            }
            current = node
        }
        return current
    }

    public topNString(dictionary: TermDictionary, N: number): string{
        let queue = new Array<CategoryNode>()
        queue.push(this.root)
        let result = ""
        while (queue.length > 0){
            let node = queue[0]
            queue.splice(0, 1)
            if (node != this.root){
                result += node.topNString(dictionary, N) + "\n"
            }
            for (let child of node.getChildren()){
                queue.push(child)
            }
        }
        return result
    }
}