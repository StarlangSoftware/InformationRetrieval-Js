import {CounterHashMap} from "nlptoolkit-datastructure/dist/CounterHashMap";
import {TermDictionary} from "./TermDictionary";
import {Query} from "../Query/Query";
import {Term} from "./Term";

export class CategoryNode {

    private children: Array<CategoryNode> = new Array<CategoryNode>()
    private readonly parent: CategoryNode
    private counts: CounterHashMap<number> = new CounterHashMap<number>()
    private categoryWords: Array<string> = new Array<string>()

    constructor(name: string, parent: CategoryNode) {
        this.categoryWords = name.split(" ")
        this.parent = parent
        if (parent != null) {
            parent.addChild(this)
        }
    }

    private addChild(child: CategoryNode) {
        this.children.push(child)
    }

    public getName(): string {
        let result = this.categoryWords[0]
        for (let i = 1; i < this.categoryWords.length; i++) {
            result += " " + this.categoryWords[i]
        }
        return result
    }

    public getChild(childName: string): CategoryNode {
        for (let child of this.children) {
            if (child.getName() == childName) {
                return child
            }
        }
        return null
    }

    public addCounts(termId: number, count: number) {
        let current: CategoryNode = this
        while (current.parent != null) {
            current.counts.putNTimes(termId, count)
            current = current.parent
        }
    }

    public isDescendant(ancestor: CategoryNode): boolean {
        if (this == ancestor) {
            return true
        }
        if (this.parent == null) {
            return false
        }
        return this.parent.isDescendant(ancestor)
    }

    public getChildren(): Array<CategoryNode> {
        return this.children
    }

    public toString(): string {
        if (this.parent != null) {
            if (this.parent.parent != null) {
                return this.parent.toString() + "%" + this.getName()
            } else {
                return this.getName()
            }
        }
        return ""
    }

    public setRepresentativeCount(representativeCount: number) {
        if (representativeCount <= this.counts.size) {
            let topList = this.counts.topN(representativeCount)
            this.counts = new CounterHashMap<number>()
            for (let item of topList) {
                this.counts.putNTimes(item[0], item[1])
            }
        }
    }

    public getCategoriesWithKeyword(query: Query, result: Array<CategoryNode>) {
        let categoryScore = 0
        for (let i = 0; i < query.size(); i++) {
            if (this.categoryWords.includes(query.getTerm(i).getName())) {
                categoryScore++
            }
        }
        if (categoryScore > 0) {
            result.push(this)
        }
        for (let child of this.children) {
            child.getCategoriesWithKeyword(query, result)
        }
    }

    public getCategoriesWithCosine(query: Query, dictionary: TermDictionary, result: Array<CategoryNode>) {
        let categoryScore = 0
        for (let i = 0; i < query.size(); i++) {
            let term = dictionary.getWord(query.getTerm(i).getName())
            if (term != undefined && term instanceof Term) {
                categoryScore += this.counts.count(term.getTermId())
            }
        }
        if (categoryScore > 0) {
            result.push(this)
        }
        for (let child of this.children) {
            child.getCategoriesWithCosine(query, dictionary, result)
        }
    }
}