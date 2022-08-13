import {PostingList} from "./PostingList";
import {TermDictionary} from "./TermDictionary";
import {TermOccurrence} from "./TermOccurrence";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import * as fs from "fs";
import {Query} from "../Query/Query";
import {QueryResult} from "../Query/QueryResult";

export class InvertedIndex {

    private index: Map<number, PostingList> = new Map<number, PostingList>()

    constructor(dictionaryOrFileName?: any,
                terms?: Array<TermOccurrence>,
                comparator?: WordComparator) {
        if (dictionaryOrFileName != undefined){
            if (dictionaryOrFileName instanceof TermDictionary){
                let dictionary = dictionaryOrFileName
                if (terms.length > 0){
                    let term = terms[0]
                    let i = 1
                    let previousTerm = term
                    let termId = dictionary.getWordIndex(term.getTerm().getName());
                    this.add(termId, term.getDocId())
                    let prevDocId = term.getDocId()
                    while (i < terms.length){
                        term = terms[i]
                        termId = dictionary.getWordIndex(term.getTerm().getName())
                        if (termId != -1){
                            if (term.isDifferent(previousTerm, comparator)){
                                this.add(termId, term.getDocId())
                                prevDocId = term.getDocId()
                            } else {
                                if (prevDocId != term.getDocId()){
                                    this.add(termId, term.getDocId())
                                    prevDocId = term.getDocId()
                                }
                            }
                        }
                        i++
                        previousTerm = term
                    }
                }
            } else {
                this.readPostingList(dictionaryOrFileName)
            }
        }
    }

    readPostingList(fileName: string){
        let data = fs.readFileSync(fileName + "-postings.txt", "utf-8")
        let lines = data.split("\n")
        for (let i = 0; i < lines.length; i = i + 2){
            if (lines[i] != ""){
                let items = lines[i].split(" ")
                let wordId = parseInt(items[0])
                this.index.set(wordId, new PostingList(lines[i + 1]))
            }
        }
    }

    keyComparator = (a: (string | number)[], b: (string | number)[]) =>
        (a[0] < b[0] ? -1 :
            (a[0] > b[0] ? 1 : 0))

    saveSorted(fileName: string){
        let items = []
        for (let key of this.index.keys()){
            items.push([key, this.index.get(key).writeToFile(key)])
        }
        items.sort(this.keyComparator)
        let data = ""
        for (let item of items){
            data = data + item[1]
        }
        fs.writeFileSync(fileName + "-postings.txt", data, 'utf-8')
    }

    save(fileName: string){
        let data = ""
        for (let key of this.index.keys()){
            data = data + this.index.get(key).writeToFile(key)
        }
        fs.writeFileSync(fileName + "-postings.txt", data, 'utf-8')
    }

    add(termId: number, docId: number){
        let postingList
        if (!this.index.has(termId)){
            postingList = new PostingList()
        } else {
            postingList = this.index.get(termId)
        }
        postingList.add(docId)
        this.index.set(termId, postingList)
    }

    postingListComparator = (listA: PostingList, listB: PostingList) =>
        (listA.size() < listB.size() ? -1 :
            (listA.size() > listB.size() ? 1 : 0))

    search(query: Query, dictionary: TermDictionary): QueryResult{
        let queryTerms = new Array<PostingList>()
        for (let i = 0; i < query.size(); i++){
            let termIndex = dictionary.getWordIndex(query.getTerm(i).getName())
            if (termIndex != -1){
                queryTerms.push(this.index.get(termIndex))
            } else {
                return new QueryResult()
            }
        }
        queryTerms.sort(this.postingListComparator);
        let result = queryTerms[0]
        for (let i = 1; i < queryTerms.length; i++){
            result = result.intersection(queryTerms[i])
        }
        return result.toQueryResult()
    }

}