import {PositionalPostingList} from "./PositionalPostingList";
import {TermOccurrence} from "./TermOccurrence";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import {TermDictionary} from "./TermDictionary";
import * as fs from "fs";
import {Query} from "../Query/Query";
import {QueryResult} from "../Query/QueryResult";
import {Document} from "../Document/Document";
import {VectorSpaceModel} from "../Query/VectorSpaceModel";
import {SearchParameter} from "../Query/SearchParameter";

export class PositionalIndex {

    private positionalIndex: Map<number, PositionalPostingList> = new Map<number, PositionalPostingList>()

    /**
     * Constructs a positional inverted index from a list of sorted tokens. The terms array should be sorted before
     * calling this method. Multiple occurrences of the same term from the same document are enlisted separately in the
     * index.
     * @param dictionary Term dictionary
     * @param terms Sorted list of tokens in the memory collection.
     * @param comparator Comparator method to compare two terms.
     */
    constructor1(dictionary: TermDictionary, terms: Array<TermOccurrence>, comparator: WordComparator) {
        if (terms.length > 0) {
            let term = terms[0]
            let i = 1
            let previousTerm = term
            let termId = dictionary.getWordIndex(term.getTerm().getName());
            this.addPosition(termId, term.getDocId(), term.getPosition())
            let prevDocId = term.getDocId()
            while (i < terms.length) {
                term = terms[i]
                termId = dictionary.getWordIndex(term.getTerm().getName())
                if (termId != -1) {
                    if (term.isDifferent(previousTerm, comparator)) {
                        this.addPosition(termId, term.getDocId(), term.getPosition())
                        prevDocId = term.getDocId()
                    } else {
                        if (prevDocId != term.getDocId()) {
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
    }

    /**
     * Reads the positional inverted index from an input file.
     * @param fileName Input file name for the positional inverted index.
     */
    constructor2(fileName: string) {
        this.readPositionalPostingList(fileName)
    }

    constructor(dictionaryOrFileName?: any,
                terms?: Array<TermOccurrence>,
                comparator?: WordComparator) {
        if (dictionaryOrFileName != undefined) {
            if (dictionaryOrFileName instanceof TermDictionary) {
                this.constructor1(dictionaryOrFileName, terms, comparator)
            } else {
                this.constructor2(dictionaryOrFileName)
            }
        }
    }

    /**
     * Reads the positional postings list of the positional index from an input file. The postings are stored in n
     * lines. The first line contains the term id and the number of documents that term occurs. Other n - 1 lines
     * contain the postings list for that term for a separate document.
     * @param fileName Positional index file.
     */
    readPositionalPostingList(fileName: string) {
        let data = fs.readFileSync(fileName + "-positionalPostings.txt", "utf-8")
        let lines = data.split("\n")
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] != "") {
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

    saveSorted(fileName: string) {
        let items = []
        for (let key of this.positionalIndex.keys()) {
            items.push([key, this.positionalIndex.get(key).writeToFile(key)])
        }
        items.sort(this.keyComparator)
        let data = ""
        for (let item of items) {
            data = data + item[1]
        }
        fs.writeFileSync(fileName + "-positionalPostings.txt", data, 'utf-8')
    }

    /**
     * Saves the positional index into the index file. The postings are stored in n lines. The first line contains the
     * term id and the number of documents that term occurs. Other n - 1 lines contain the postings list for that term
     * for a separate document.
     * @param fileName Index file name. Real index file name is created by attaching -positionalPostings.txt to this
     *                 file name
     */
    save(fileName: string) {
        let data = ""
        for (let key of this.positionalIndex.keys()) {
            data = data + this.positionalIndex.get(key).writeToFile(key)
        }
        fs.writeFileSync(fileName + "-positionalPostings.txt", data, 'utf-8')
    }

    /**
     * Adds a possible new term with a position and document id to the positional index. First the term is searched in
     * the hash map, then the position and the document id is put into the correct postings list.
     * @param termId Id of the term
     * @param docId Document id in which the term exists
     * @param position Position of the term in the document with id docId
     */
    addPosition(termId: number, docId: number, position: number) {
        let positionalPostingList
        if (!this.positionalIndex.has(termId)) {
            positionalPostingList = new PositionalPostingList()
        } else {
            positionalPostingList = this.positionalIndex.get(termId)
        }
        positionalPostingList.add(docId, position)
        this.positionalIndex.set(termId, positionalPostingList)
    }

    /**
     * Searches a given query in the document collection using positional index boolean search.
     * @param query Query string
     * @param dictionary Term dictionary
     * @return The result of the query obtained by doing positional index boolean search in the collection.
     */
    positionalSearch(query: Query, dictionary: TermDictionary): QueryResult {
        let postingResult: any = null
        for (let i = 0; i < query.size(); i++) {
            let term = dictionary.getWordIndex(query.getTerm(i).getName())
            if (term != -1) {
                if (i == 0) {
                    postingResult = this.positionalIndex.get(term);
                } else {
                    if (postingResult != null) {
                        postingResult = postingResult.intersection(this.positionalIndex.get(term))
                    } else {
                        return new QueryResult()
                    }
                }
            } else {
                return new QueryResult()
            }
        }
        if (postingResult != null) {
            return postingResult.toQueryResult()
        } else {
            return new QueryResult()
        }
    }

    /**
     * Returns the term frequencies  in a given document.
     * @param docId Id of the document
     * @return Term frequencies of the given document.
     */
    getTermFrequencies(docId: number): Array<number> {
        let tf = new Array<number>()
        let i = 0
        for (let key of this.positionalIndex.keys()) {
            let positionalPostingList = this.positionalIndex.get(key)
            let index = positionalPostingList.getIndex(docId)
            if (index != -1) {
                tf.push(positionalPostingList.get(index).size())
            } else {
                tf.push(0)
            }
            i++
        }
        return tf
    }

    /**
     * Returns the document frequencies of the terms in the collection.
     * @return The document frequencies of the terms in the collection.
     */
    getDocumentFrequencies(): Array<number> {
        let df = new Array<number>()
        let i = 0
        for (let key of this.positionalIndex.keys()) {
            df.push(this.positionalIndex.get(key).size())
            i++
        }
        return df
    }

    /**
     * Calculates and sets the number of terms in each document in the document collection.
     * @param documents Document collection.
     */
    setDocumentSizes(documents: Array<Document>) {
        let sizes = new Array<number>()
        for (let i = 0; i < documents.length; i++) {
            sizes.push(0)
        }
        for (let key of this.positionalIndex.keys()) {
            let positionalPostingList = this.positionalIndex.get(key)
            for (let j = 0; j < positionalPostingList.size(); j++) {
                let positionalPosting = positionalPostingList.get(j)
                let docId = positionalPosting.getDocId()
                sizes[docId] += positionalPosting.size()
            }
        }
        for (let doc of documents) {
            doc.setSize(sizes[doc.getDocId()])
        }
    }

    /**
     * Calculates and updates the frequency counts of the terms in each category node.
     * @param documents Document collection.
     */
    setCategoryCounts(documents: Array<Document>) {
        for (let termId of this.positionalIndex.keys()) {
            let positionalPostingList = this.positionalIndex.get(termId)
            for (let j = 0; j < positionalPostingList.size(); j++) {
                let positionalPosting = positionalPostingList.get(j)
                let docId = positionalPosting.getDocId()
                documents[docId].getCategoryNode().addCounts(termId, positionalPosting.size())
            }
        }
    }

    /**
     * Searches a given query in the document collection using inverted index ranked search.
     * @param query Query string
     * @param dictionary Term dictionary
     * @param documents Document collection
     * @param parameter Search parameter
     * @return The result of the query obtained by doing inverted index ranked search in the collection.
     */
    rankedSearch(query: Query,
                 dictionary: TermDictionary,
                 documents: Array<Document>,
                 parameter: SearchParameter): QueryResult {
        let N = documents.length
        let result = new QueryResult()
        let scores = new Map<number, number>()
        for (let i = 0; i < query.size(); i++) {
            let term = dictionary.getWordIndex(query.getTerm(i).getName())
            if (term != -1) {
                let positionalPostingList = this.positionalIndex.get(term)
                for (let j = 0; j < positionalPostingList.size(); j++) {
                    let positionalPosting = positionalPostingList.get(j)
                    let docID = positionalPosting.getDocId();
                    let tf = positionalPosting.size();
                    let df = this.positionalIndex.get(term).size();
                    if (tf > 0 && df > 0) {
                        let score = VectorSpaceModel.weighting(tf, df, N, parameter.getTermWeighting(), parameter.getDocumentWeighting())
                        if (scores.has(docID)) {
                            scores.set(docID, scores.get(docID) + score)
                        } else {
                            scores.set(docID, score)
                        }
                    }
                }
            }
        }
        for (let docID of scores.keys()) {
            result.add(docID, scores.get(docID) / documents[docID].getSize())
        }
        return result
    }
}