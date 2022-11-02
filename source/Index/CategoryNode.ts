import {CounterHashMap} from "nlptoolkit-datastructure/dist/CounterHashMap";
import {TermDictionary} from "./TermDictionary";
import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";

export class CategoryNode {

    private readonly name: string
    private children: Array<CategoryNode> = new Array<CategoryNode>()
    private readonly parent: CategoryNode
    private counts: CounterHashMap<number> = new CounterHashMap<number>()

    constructor(name: string, parent: CategoryNode) {
        this.name = name
        this.parent = parent
        if (parent != null){
            parent.addChild(this)
        }
    }

    private addChild(child: CategoryNode){
        this.children.push(child)
    }

    public getName(): string{
        return this.name
    }

    public getChild(childName: string): CategoryNode{
        for (let child of this.children){
            if (child.getName() == childName){
                return child
            }
        }
        return null
    }

    public addCounts(termId: number, count: number){
        let current : CategoryNode = this
        while (current.parent != null){
            current.counts.putNTimes(termId, count)
            current = current.parent
        }
    }

    public getChildren(): Array<CategoryNode>{
        return this.children
    }

    public topN(N: number): Array<[number, number]>{
        if (N <= this.counts.size){
            return this.counts.topN(N)
        } else {
            return this.counts.topN(this.counts.size)
        }
    }

    public topNString(dictionary: TermDictionary, N: number): string{
        let topN = this.topN(N)
        let result : string = this.toString()
        for (let item of topN){
            if (!Word.isPunctuation(dictionary.getWord(item[0]).getName())){
                result += "\t" + dictionary.getWord(item[0]).getName() + " (" + item[1] + ")"
            }
        }
        return result
    }

    public toString(): string{
        if (this.parent != null){
            if (this.parent.parent != null){
                return this.parent.toString() + "%" + this.name
            } else {
                return this.name
            }
        }
        return ""
    }
}