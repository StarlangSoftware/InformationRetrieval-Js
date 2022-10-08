import {PositionalPostingList} from "./PositionalPostingList";
import {TermOccurrence} from "./TermOccurrence";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import {TermDictionary} from "./TermDictionary";
import * as fs from "fs";
import {Query} from "../Query/Query";
import {QueryResult} from "../Query/QueryResult";
import {Document} from "../Document/Document";
import {TermWeighting} from "./TermWeighting";
import {DocumentWeighting} from "../Document/DocumentWeighting";
import {VectorSpaceModel} from "../Query/VectorSpaceModel";

export class PositionalIndex {

    private positionalIndex: Map<number, PositionalPostingList> = new Map<number, PositionalPostingList>()

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
                    this.addPosition(termId, term.getDocId(), term.getPosition())
                    let prevDocId = term.getDocId()
                    while (i < terms.length){
                        term = terms[i]
                        termId = dictionary.getWordIndex(term.getTerm().getName())
                        if (termId != -1){
                            if (term.isDifferent(previousTerm, comparator)){
                                this.addPosition(termId, term.getDocId(), term.getPosition())
                                prevDocId = term.getDocId()
                            } else {
                                if (prevDocId != term.getDocId()){
                                    this.addPosition(termId, term.getDocId(), term.getPosition())
                                    prevDocId = term.getDocId()
                                } else {
                                    this.addPosition(termId, term.getDocId(), term.getPosition())
                                }
                            }
                        }
                        i++
                        previousTerm = term
                    }
                }
            } else {
                this.readPositionalPostingList(dictionaryOrFileName)
            }
        }
    }

    readPositionalPostingList(fileName: string){
        let data = fs.readFileSync(fileName + "-positionalPostings.txt", "utf-8")
        let lines = data.split("\n")
        for (let i = 0; i < lines.length; i++){
            if (lines[i] != ""){
                let items = lines[i].split(" ")
                let wordId = parseInt(items[0])
                let count = parseInt(items[1])
                this.positionalIndex.set(wordId, new PositionalPostingList(lines.slice(i + 1, i + count + 1)))
                i += count
            }
        }
    }

    keyComparator = (a: (string | number)[], b: (string | number)[]) =>
        (a[0] < b[0] ? -1 :
            (a[0] > b[0] ? 1 : 0))

    saveSorted(fileName: string){
        let items = []
        for (let key of this.positionalIndex.keys()){
            items.push([key, this.positionalIndex.get(key).writeToFile(key)])
        }
        items.sort(this.keyComparator)
        let data = ""
        for (let item of items){
            data = data + item[1]
        }
        fs.writeFileSync(fileName + "-positionalPostings.txt", data, 'utf-8')
    }

    save(fileName: string){
        let data = ""
        for (let key of this.positionalIndex.keys()){
            data = data + this.positionalIndex.get(key).writeToFile(key)
        }
        fs.writeFileSync(fileName + "-positionalPostings.txt", data, 'utf-8')
    }

    addPosition(termId: number, docId: number, position: number){
        let positionalPostingList
        if (!this.positionalIndex.has(termId)){
            positionalPostingList = new PositionalPostingList()
        } else {
            positionalPostingList = this.positionalIndex.get(termId)
        }
        positionalPostingList.add(docId, position)
        this.positionalIndex.set(termId, positionalPostingList)
    }

    positionalSearch(query: Query, dictionary: TermDictionary): QueryResult{
        let postingResult : any = null
        for (let i = 0; i < query.size(); i++){
            let term = dictionary.getWordIndex(query.getTerm(i).getName())
            if (term != -1){
                if (i == 0){
                    postingResult = this.positionalIndex.get(term);
                } else {
                    if (postingResult != null){
                        postingResult = postingResult.intersection(this.positionalIndex.get(term))
                    } else {
                        return new QueryResult()
                    }
                }
            } else {
                return new QueryResult()
            }
        }
        if (postingResult != null){
            return postingResult.toQueryResult()
        } else {
            return new QueryResult()
        }
    }

    getTermFrequencies(docId: number): Array<number>{
        let tf = new Array<number>()
        let i = 0
        for (let key of this.positionalIndex.keys()){
            let positionalPostingList = this.positionalIndex.get(key)
            let index = positionalPostingList.getIndex(docId)
            if (index != -1){
                tf.push(positionalPostingList.get(index).size())
            } else {
                tf.push(0)
            }
            i++
        }
        return tf
    }

    getDocumentFrequencies(): Array<number>{
        let df = new Array<number>()
        let i = 0
        for (let key of this.positionalIndex.keys()){
            df.push(this.positionalIndex.get(key).size())
            i++
        }
        return df
    }

    setDocumentSizes(documents: Array<Document>){
        let sizes = new Array<number>()
        for (let i = 0; i < documents.length; i++){
            sizes.push(0)
        }
        for (let key of this.positionalIndex.keys()){
            let positionalPostingList = this.positionalIndex.get(key)
            for (let j = 0; j < positionalPostingList.size(); j++){
                let positionalPosting = positionalPostingList.get(j)
                let docId = positionalPosting.getDocId()
                sizes[docId] += positionalPosting.size()
            }
        }
        for (let doc of documents){
            doc.setSize(sizes[doc.getDocId()])
        }
    }

    rankedSearch(query:Query,
                 dictionary: TermDictionary,
                 documents: Array<Document>,
                 termWeighting: TermWeighting,
                 documentWeighting: DocumentWeighting): QueryResult{
        let N = documents.length
        let result = new QueryResult()
        let scores = new Array<number>()
        for (let i = 0; i < N; i++){
            scores.push(0.0)
        }
        for (let i = 0; i < query.size(); i++){
            let term = dictionary.getWordIndex(query.getTerm(i).getName())
            if (term != -1){
                let positionalPostingList = this.positionalIndex.get(term)
                for (let j = 0; j < positionalPostingList.size(); j++){
                    let positionalPosting = positionalPostingList.get(j)
                    let docID = positionalPosting.getDocId();
                    let tf = positionalPosting.size();
                    let df = this.positionalIndex.get(term).size();
                    if (tf > 0 && df > 0){
                        scores[docID] += VectorSpaceModel.weighting(tf, df, N, termWeighting, documentWeighting)
                    }
                }
            }
        }
        for (let i = 0; i < N; i++){
            scores[i] /= documents[i].getSize()
            if (scores[i] > 0.0){
                result.add(i, scores[i])
            }
        }
        result.sort()
        return result
    }
}