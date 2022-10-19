export class CategoryHierarchy {

    private readonly categoryList: Array<string>

    constructor(list: string) {
        this.categoryList = list.split("%")
    }

    toString(): string{
        let result: string = this.categoryList[0]
        for (let i = 1; i < this.categoryList.length; i++){
            result = result + this.categoryList[i]
        }
        return result
    }
}