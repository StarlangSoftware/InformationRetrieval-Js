import {IndexType} from "./IndexType";
import {TermDictionary} from "../Index/TermDictionary";
import {IncidenceMatrix} from "../Index/IncidenceMatrix";
import {NGramIndex} from "../Index/NGramIndex";
import {InvertedIndex} from "../Index/InvertedIndex";
import {PositionalIndex} from "../Index/PositionalIndex";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import {Parameter} from "./Parameter";
import {Document} from "./Document";
import {TermType} from "../Index/TermType";
import * as fs from "fs";
import {TermOccurrence} from "../Index/TermOccurrence";
import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";
import {Query} from "../Query/Query";
import {RetrievalType} from "../Query/RetrievalType";
import {QueryResult} from "../Query/QueryResult";
import {Term} from "../Index/Term";
import {PositionalPostingList} from "../Index/PositionalPostingList";
import {PostingList} from "../Index/PostingList";
import {SearchParameter} from "../Query/SearchParameter";
import {DocumentType} from "./DocumentType";
import {CategoryTree} from "../Index/CategoryTree";

export class Collection {

    private readonly indexType: IndexType
    private dictionary: TermDictionary
    private phraseDictionary: TermDictionary
    private biGramDictionary: TermDictionary
    private triGramDictionary: TermDictionary
    private documents: Array<Document> = new Array<Document>()
    private incidenceMatrix: IncidenceMatrix
    private invertedIndex: InvertedIndex
    private biGramIndex: NGramIndex
    private triGramIndex: NGramIndex
    private positionalIndex: PositionalIndex
    private phraseIndex: InvertedIndex
    private phrasePositionalIndex: PositionalIndex
    private readonly comparator: WordComparator
    private readonly name: string
    private parameter: Parameter
    private categoryTree: CategoryTree

    constructor(directory: string, parameter: Parameter) {
        this.name = directory;
        this.indexType = parameter.getIndexType();
        this.comparator = parameter.getWordComparator();
        this.parameter = parameter;
        let files = fs.readdirSync(directory);
        files.sort()
        let fileLimit = files.length
        if (parameter.limitNumberOfDocumentsLoaded()){
            fileLimit = parameter.getDocumentLimit()
        }
        let i = 0
        let j = 0
        while (i < files.length && j < fileLimit) {
            let file = files[i]
            if (file.endsWith(".txt")) {
                let document = new Document(parameter.getDocumentType(), directory + "/" + file, file, j)
                this.documents.push(document)
                j++
            }
            i++
        }
        if (parameter.loadIndexesFromFile()){
            if (parameter.getDocumentType() == DocumentType.CATEGORICAL){
                this.loadCategories()
            }
            this.dictionary = new TermDictionary(this.comparator, directory)
            this.invertedIndex = new InvertedIndex(directory)
            if (parameter.constructPositionalIndex()){
                this.positionalIndex = new PositionalIndex(directory)
                this.positionalIndex.setDocumentSizes(this.documents)
            }
            if (parameter.constructPhraseIndex()){
                this.phraseDictionary = new TermDictionary(this.comparator, directory + "-phrase")
                this.phraseIndex = new InvertedIndex(directory + "-phrase")
                if (parameter.constructPositionalIndex()){
                    this.phrasePositionalIndex = new PositionalIndex(directory + "-phrase")
                }
            }
            if (parameter.constructNGramIndex()){
                this.biGramDictionary = new TermDictionary(this.comparator, directory + "-biGram")
                this.triGramDictionary = new TermDictionary(this.comparator, directory + "-triGram")
                this.biGramIndex = new NGramIndex(directory + "-biGram")
                this.triGramIndex = new NGramIndex(directory + "-triGram")
            }
        } else {
            if (parameter.constructDictionaryInDisk()){
                this.constructDictionaryInDisk()
            } else {
                if (parameter.constructIndexInDisk()){
                    this.constructIndexesInDisk()
                } else {
                    this.constructIndexesInMemory()
                }
            }
        }
        if (parameter.getDocumentType() == DocumentType.CATEGORICAL){
            this.positionalIndex.setCategoryCounts(this.documents);
        }
    }

    size(): number{
        return this.documents.length
    }

    vocabularySize(): number{
        return this.dictionary.size()
    }

    save(){
        if (this.indexType == IndexType.INVERTED_INDEX){
            this.dictionary.save(this.name)
            this.invertedIndex.save(this.name);
            if (this.parameter.constructPositionalIndex()){
                this.positionalIndex.save(this.name)
            }
            if (this.parameter.constructPhraseIndex()){
                this.phraseDictionary.save(this.name + "-phrase")
                this.phraseIndex.save(this.name + "-phrase")
                if (this.parameter.constructPositionalIndex()){
                    this.phrasePositionalIndex.save(this.name + "-phrase")
                }
            }
            if (this.parameter.constructNGramIndex()){
                this.biGramDictionary.save(this.name + "-biGram")
                this.triGramDictionary.save(this.name + "-triGram")
                this.biGramIndex.save(this.name + "-biGram")
                this.triGramIndex.save(this.name + "-triGram")
            }
        }
        if (this.parameter.getDocumentType() == DocumentType.CATEGORICAL){
            this.saveCategories()
        }
    }

    saveCategories(){
        let output = ""
        for (let document of this.documents){
            output = output + document.getDocId() + "\t" + document.getCategory().toString() + "\n"
        }
        fs.writeFileSync(this.name + "-categories.txt", output,"utf-8")
    }

    loadCategories(){
        this.categoryTree = new CategoryTree(this.name)
        let lines = fs.readFileSync(this.name + "-categories.txt", "utf-8").split('\n')
        for (let line of lines){
            if (line != ""){
                let items = line.split("\t")
                let docId = parseInt(items[0])
                this.documents[docId].setCategory(this.categoryTree, items[1])
            }
        }
    }

    constructDictionaryInDisk(){
        this.constructDictionaryAndInvertedIndexInDisk(TermType.TOKEN)
        if (this.parameter.constructPositionalIndex()){
            this.constructDictionaryAndPositionalIndexInDisk(TermType.TOKEN)
        }
        if (this.parameter.constructPhraseIndex()){
            this.constructDictionaryAndInvertedIndexInDisk(TermType.PHRASE)
            if (this.parameter.constructPositionalIndex()){
                this.constructDictionaryAndPositionalIndexInDisk(TermType.PHRASE)
            }
        }
        if (this.parameter.constructNGramIndex()){
            this.constructNGramDictionaryAndIndexInDisk()
        }
    }

    constructIndexesInDisk(){
        let wordList = this.constructDistinctWordList(TermType.TOKEN);
        this.dictionary = new TermDictionary(this.comparator, wordList)
        this.constructInvertedIndexInDisk(this.dictionary, TermType.TOKEN)
        if (this.parameter.constructPositionalIndex()){
            this.constructPositionalIndexInDisk(this.dictionary, TermType.TOKEN)
        }
        if (this.parameter.constructPhraseIndex()){
            wordList = this.constructDistinctWordList(TermType.PHRASE)
            this.phraseDictionary = new TermDictionary(this.comparator, wordList)
            this.constructInvertedIndexInDisk(this.phraseDictionary, TermType.PHRASE)
            if (this.parameter.constructPositionalIndex()){
                this.constructPositionalIndexInDisk(this.phraseDictionary, TermType.PHRASE)
            }
        }
        if (this.parameter.constructNGramIndex()){
            this.constructNGramIndex()
        }
    }

    constructIndexesInMemory(){
        let terms = this.constructTerms(TermType.TOKEN);
        this.dictionary = new TermDictionary(this.comparator, terms);
        switch (this.indexType){
            case IndexType.INCIDENCE_MATRIX:
                this.incidenceMatrix = new IncidenceMatrix(this.documents.length, terms, this.dictionary)
                break;
            case IndexType.INVERTED_INDEX:
                this.invertedIndex = new InvertedIndex(this.dictionary, terms, this.comparator)
                if (this.parameter.constructPositionalIndex()){
                    this.positionalIndex = new PositionalIndex(this.dictionary, terms, this.comparator)
                }
                if (this.parameter.constructPhraseIndex()){
                    terms = this.constructTerms(TermType.PHRASE)
                    this.phraseDictionary = new TermDictionary(this.comparator, terms)
                    this.phraseIndex = new InvertedIndex(this.phraseDictionary, terms, this.comparator)
                    if (this.parameter.constructPositionalIndex()){
                        this.phrasePositionalIndex = new PositionalIndex(this.phraseDictionary, terms, this.comparator)
                    }
                }
                if (this.parameter.constructNGramIndex()){
                    this.constructNGramIndex()
                }
                if (this.parameter.getDocumentType() == DocumentType.CATEGORICAL){
                    this.categoryTree = new CategoryTree(this.name);
                    for (let document of this.documents){
                        document.loadCategory(this.categoryTree);
                    }
                }
                break;
        }
    }

    termComparator = (comparator: WordComparator) =>
        (termA: TermOccurrence, termB: TermOccurrence) => (TermOccurrence.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) != 0 ?
                TermOccurrence.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) :
                (termA.getDocId() == termB.getDocId() ?
                    (termA.getPosition() == termB.getPosition() ?
                        0 : (termA.getPosition() < termB.getPosition() ?
                            -1 : 1)) :
                    (termA.getDocId() < termB.getDocId() ?
                        -1 : 1))
        )

    constructTerms(termType: TermType): Array<TermOccurrence>{
        let terms = new Array<TermOccurrence>()
        for (let doc of this.documents){
            let documentText = doc.loadDocument()
            let docTerms = documentText.constructTermList(doc.getDocId(), termType)
            terms = terms.concat(docTerms)
        }
        terms.sort(this.termComparator(this.comparator))
        return terms;
    }

    constructDistinctWordList(termType: TermType): Set<string>{
        let words = new Set<string>()
        for (let doc of this.documents){
            let documentText = doc.loadDocument()
            let wordList = documentText.constructDistinctWordList(termType)
            for (let word of wordList){
                words.add(word)
            }
        }
        return words
    }

    notCombinedAllIndexes(currentIdList: Array<number>): boolean{
        for (let id of currentIdList){
            if (id != -1){
                return true
            }
        }
        return false
    }

    notCombinedAllDictionaries(currentWords: Array<string>): boolean{
        for (let word of currentWords){
            if (word != null){
                return true
            }
        }
        return false
    }

    selectIndexesWithMinimumTermIds(currentIdList: Array<number>): Array<number>{
        let result = new Array<number>()
        let min = Number.MAX_VALUE
        for (let id of currentIdList){
            if (id != -1 && id < min){
                min = id
            }
        }
        for (let i = 0; i < currentIdList.length; i++){
            if (currentIdList[i] == min){
                result.push(i)
            }
        }
        return result
    }

    selectDictionariesWithMinimumWords(currentWords: Array<string>): Array<number>{
        let result = new Array<number>()
        let min = null
        for (let word of currentWords){
            if (word != null && (min == null || TermOccurrence.wordComparator(this.comparator)(new Word(word), new Word(min)) < 0)){
                min = word
            }
        }
        for (let i = 0; i < currentWords.length; i++){
            if (currentWords[i] != null && currentWords[i] == min){
                result.push(i)
            }
        }
        return result
    }

    hashCode(s: string): number{
        let hash = 0
        for (let i = 0; i < s.length; i++) {
            let code = s.charCodeAt(i)
            hash = ((hash << 5) - hash) + code
            hash = hash & hash
        }
        return hash
    }

    addNGramsToDictionaryAndIndex(line: string,
                                  k: number,
                                  nGramDictionary: TermDictionary,
                                  nGramIndex: NGramIndex){
        let wordId = parseInt(line.substring(0, line.indexOf(" ")))
        let word = line.substring(line.indexOf(" ") + 1)
        let biGrams = TermDictionary.constructNGrams(word, wordId, k)
        for (let term of biGrams){
            let termId
            let wordIndex = nGramDictionary.getWordIndex(term.getTerm().getName())
            if (wordIndex != -1){
                termId = (<Term> nGramDictionary.getWord(wordIndex)).getTermId()
            } else {
                termId = Math.abs(this.hashCode(term.getTerm().getName()))
                nGramDictionary.addTerm(term.getTerm().getName(), termId)
            }
            nGramIndex.add(termId, wordId)
        }
    }

    getLine(filesData: Array<Array<string>>, files: Array<number>, index: number): string{
        let line = filesData[index][files[index]]
        files[index]++
        return line
    }

    getLines(filesData: Array<Array<string>>, files: Array<number>, index: number, lineCount: number){
        let postingData = filesData[index].slice(files[index], files[index] + lineCount)
        files[index] += lineCount
        return postingData
    }

    combineMultipleDictionariesInDisk(name: string, tmpName: string, blockCount: number){
        let currentIdList = new Array<number>()
        let currentWords = new Array<string>()
        let files = new Array<number>()
        let filesData = new Array<Array<string>>()
        let output = ""
        for (let i = 0; i < blockCount; i++){
            files.push(0)
            filesData.push(fs.readFileSync("tmp-" + tmpName + i + "-dictionary.txt", "utf-8").split('\n'))
            let line = this.getLine(filesData, files, i)
            currentIdList.push(parseInt(line.substring(0, line.indexOf(" "))))
            currentWords.push(line.substring(line.indexOf(" ") + 1))
        }
        while (this.notCombinedAllDictionaries(currentWords)){
            let indexesToCombine = this.selectDictionariesWithMinimumWords(currentWords)
            output = output + currentIdList[indexesToCombine[0]].toString() + " " + currentWords[indexesToCombine[0]].toString() + "\n"
            for (let i of indexesToCombine) {
                let line = this.getLine(filesData, files, i)
                if (files[i] < filesData[i].length) {
                    currentIdList[i] = parseInt(line.substring(0, line.indexOf(" ")))
                    currentWords[i] = line.substring(line.indexOf(" ") + 1)
                } else {
                    currentWords[i] = null
                }
            }
        }
        fs.writeFileSync(name + "-dictionary.txt", output,"utf-8")
    }

    combineMultipleInvertedIndexesInDisk(name: string, tmpName: string, blockCount: number){
        let currentIdList = new Array<number>()
        let currentPostingLists = new Array<PostingList>()
        let files = new Array<number>()
        let filesData = new Array<Array<string>>()
        let output = ""
        for (let i = 0; i < blockCount; i++){
            files.push(0)
            filesData.push(fs.readFileSync("tmp-" + tmpName + i + "-postings.txt", "utf-8").split('\n'))
            let line = this.getLine(filesData, files, i)
            let items = line.split(" ")
            currentIdList.push(parseInt(items[0]))
            line = this.getLine(filesData, files, i)
            currentPostingLists.push(new PostingList(line))
        }
        while (this.notCombinedAllIndexes(currentIdList)){
            let indexesToCombine = this.selectIndexesWithMinimumTermIds(currentIdList)
            let mergedPostingList = currentPostingLists[indexesToCombine[0]]
            for (let i = 1; i < indexesToCombine.length; i++){
                mergedPostingList = mergedPostingList.union(currentPostingLists[indexesToCombine[i]])
            }
            output = output + mergedPostingList.writeToFile(currentIdList[indexesToCombine[0]])
            for (let i of indexesToCombine) {
                let line = this.getLine(filesData, files, i)
                if (files[i] < filesData[i].length) {
                    let items = line.split(" ")
                    currentIdList[i] = parseInt(items[0])
                    line = this.getLine(filesData, files, i)
                    currentPostingLists[i] = new PostingList(line)
                } else {
                    currentIdList[i] = -1
                }
            }
        }
        fs.writeFileSync(name + "-postings.txt", output,"utf-8")
    }

    combineMultiplePositionalIndexesInDisk(name: string, blockCount: number){
        let currentIdList = new Array<number>()
        let currentPostingLists = new Array<PositionalPostingList>()
        let files = new Array<number>()
        let filesData = new Array<Array<string>>()
        let output = ""
        for (let i = 0; i < blockCount; i++){
            files.push(0)
            filesData.push(fs.readFileSync("tmp-" + i + "-positionalPostings.txt", "utf-8").split('\n'))
            let line = this.getLine(filesData, files, i)
            let items = line.split(" ")
            currentIdList.push(parseInt(items[0]))
            let lineCount = parseInt(items[1])
            currentPostingLists.push(new PositionalPostingList(this.getLines(filesData, files, i, lineCount)))
        }
        while (this.notCombinedAllIndexes(currentIdList)){
            let indexesToCombine = this.selectIndexesWithMinimumTermIds(currentIdList)
            let mergedPostingList = currentPostingLists[indexesToCombine[0]]
            for (let i = 1; i < indexesToCombine.length; i++){
                mergedPostingList = mergedPostingList.union(currentPostingLists[indexesToCombine[i]])
            }
            output = output + mergedPostingList.writeToFile(currentIdList[indexesToCombine[0]])
            for (let i of indexesToCombine) {
                let line = this.getLine(filesData, files, i)
                if (files[i] < filesData[i].length) {
                    let items = line.split(" ")
                    currentIdList[i] = parseInt(items[0])
                    let lineCount = parseInt(items[1])
                    currentPostingLists[i] = new PositionalPostingList(this.getLines(filesData, files, i, lineCount))
                } else {
                    currentIdList[i] = -1
                }
            }
        }
        fs.writeFileSync(name + "-positionalPostings.txt", output,"utf-8")
    }

    constructNGramDictionaryAndIndexInDisk(){
        let i = 0, blockCount = 0;
        let biGramDictionary = new TermDictionary(this.comparator)
        let triGramDictionary = new TermDictionary(this.comparator)
        let biGramIndex = new NGramIndex()
        let triGramIndex = new NGramIndex()
        let data = fs.readFileSync(this.name + "-dictionary.txt", 'utf-8')
        let lines = data.split('\n')
        for (let line of lines){
            if (i < this.parameter.getWordLimit()){
                i++;
            } else {
                biGramDictionary.save("tmp-biGram-" + blockCount)
                triGramDictionary.save("tmp-triGram-" + blockCount)
                biGramDictionary = new TermDictionary(this.comparator)
                triGramDictionary = new TermDictionary(this.comparator)
                biGramIndex.save("tmp-biGram-" + blockCount)
                biGramIndex = new NGramIndex()
                triGramIndex.save("tmp-triGram-" + blockCount)
                triGramIndex = new NGramIndex()
                blockCount++
                i = 0
            }
            this.addNGramsToDictionaryAndIndex(line, 2, biGramDictionary, biGramIndex)
            this.addNGramsToDictionaryAndIndex(line, 3, triGramDictionary, triGramIndex)
        }
        if (this.documents.length != 0){
            biGramDictionary.save("tmp-biGram-" + blockCount)
            triGramDictionary.save("tmp-triGram-" + blockCount)
            biGramIndex.save("tmp-biGram-" + blockCount)
            triGramIndex.save("tmp-triGram-" + blockCount)
            blockCount++
        }
        this.combineMultipleDictionariesInDisk(this.name + "-biGram", "biGram-", blockCount);
        this.combineMultipleDictionariesInDisk(this.name + "-triGram", "triGram-", blockCount);
        this.combineMultipleInvertedIndexesInDisk(this.name + "-biGram", "biGram-", blockCount);
        this.combineMultipleInvertedIndexesInDisk(this.name + "-triGram", "triGram-", blockCount);
    }

    constructInvertedIndexInDisk(dictionary: TermDictionary, termType: TermType){
        let i = 0, blockCount = 0
        let invertedIndex = new InvertedIndex()
        for (let doc of this.documents){
            if (i < this.parameter.getDocumentLimit()){
                i++
            } else {
                invertedIndex.saveSorted("tmp-" + blockCount)
                invertedIndex = new InvertedIndex()
                blockCount++
                i = 0
            }
            let documentText = doc.loadDocument()
            let wordList = documentText.constructDistinctWordList(termType)
            for (let word of wordList){
                let termId = dictionary.getWordIndex(word)
                invertedIndex.add(termId, doc.getDocId())
            }
        }
        if (this.documents.length != 0){
            invertedIndex.saveSorted("tmp-" + blockCount)
            blockCount++
        }
        if (termType == TermType.TOKEN){
            this.combineMultipleInvertedIndexesInDisk(this.name, "", blockCount)
        } else {
            this.combineMultipleInvertedIndexesInDisk(this.name + "-phrase", "", blockCount)
        }
    }

    constructDictionaryAndInvertedIndexInDisk(termType: TermType){
        let i = 0, blockCount = 0
        let invertedIndex = new InvertedIndex();
        let dictionary = new TermDictionary(this.comparator)
        for (let doc of this.documents){
            if (i < this.parameter.getDocumentLimit()){
                i++
            } else {
                dictionary.save("tmp-" + blockCount)
                dictionary = new TermDictionary(this.comparator)
                invertedIndex.saveSorted("tmp-" + blockCount)
                invertedIndex = new InvertedIndex()
                blockCount++
                i = 0
            }
            let documentText = doc.loadDocument()
            let wordList = documentText.constructDistinctWordList(termType)
            for (let word of wordList){
                let termId
                let wordIndex = dictionary.getWordIndex(word)
                if (wordIndex != -1){
                    termId = (<Term> dictionary.getWord(wordIndex)).getTermId()
                } else {
                    termId = Math.abs(this.hashCode(word))
                    dictionary.addTerm(word, termId)
                }
                invertedIndex.add(termId, doc.getDocId())
            }
        }
        if (this.documents.length != 0){
            dictionary.save("tmp-" + blockCount)
            invertedIndex.saveSorted("tmp-" + blockCount)
            blockCount++
        }
        if (termType == TermType.TOKEN){
            this.combineMultipleDictionariesInDisk(this.name, "", blockCount)
            this.combineMultipleInvertedIndexesInDisk(this.name, "", blockCount)
        } else {
            this.combineMultipleDictionariesInDisk(this.name + "-phrase", "", blockCount)
            this.combineMultipleInvertedIndexesInDisk(this.name + "-phrase", "", blockCount)
        }
    }

    constructDictionaryAndPositionalIndexInDisk(termType: TermType){
        let i = 0, blockCount = 0
        let positionalIndex = new PositionalIndex();
        let dictionary = new TermDictionary(this.comparator)
        for (let doc of this.documents){
            if (i < this.parameter.getDocumentLimit()){
                i++
            } else {
                dictionary.save("tmp-" + blockCount)
                dictionary = new TermDictionary(this.comparator)
                positionalIndex.saveSorted("tmp-" + blockCount)
                positionalIndex = new PositionalIndex()
                blockCount++;
                i = 0;
            }
            let documentText = doc.loadDocument()
            let terms = documentText.constructTermList(doc.getDocId(), termType)
            for (let termOccurrence of terms){
                let termId
                let wordIndex = dictionary.getWordIndex(termOccurrence.getTerm().getName())
                if (wordIndex != -1){
                    termId = (<Term> dictionary.getWord(wordIndex)).getTermId()
                } else {
                    termId = Math.abs(this.hashCode(termOccurrence.getTerm().getName()))
                    dictionary.addTerm(termOccurrence.getTerm().getName(), termId)
                }
                positionalIndex.addPosition(termId, termOccurrence.getDocId(), termOccurrence.getPosition())
            }
        }
        if (this.documents.length != 0){
            dictionary.save("tmp-" + blockCount)
            positionalIndex.saveSorted("tmp-" + blockCount)
            blockCount++;
        }
        if (termType == TermType.TOKEN){
            this.combineMultipleDictionariesInDisk(this.name, "", blockCount);
            this.combineMultiplePositionalIndexesInDisk(this.name, blockCount);
        } else {
            this.combineMultipleDictionariesInDisk(this.name + "-phrase", "", blockCount);
            this.combineMultiplePositionalIndexesInDisk(this.name + "-phrase", blockCount);
        }
    }

    constructPositionalIndexInDisk(dictionary: TermDictionary, termType: TermType){
        let i = 0, blockCount = 0
        let positionalIndex = new PositionalIndex()
        for (let doc of this.documents){
            if (i < this.parameter.getDocumentLimit()){
                i++
            } else {
                positionalIndex.saveSorted("tmp-" + blockCount)
                positionalIndex = new PositionalIndex()
                blockCount++
                i = 0;
            }
            let documentText = doc.loadDocument()
            let terms = documentText.constructTermList(doc.getDocId(), termType)
            for (let termOccurrence of terms){
                let termId = dictionary.getWordIndex(termOccurrence.getTerm().getName());
                positionalIndex.addPosition(termId, termOccurrence.getDocId(), termOccurrence.getPosition())
            }
        }
        if (this.documents.length != 0){
            positionalIndex.saveSorted("tmp-" + blockCount);
            blockCount++;
        }
        if (termType == TermType.TOKEN){
            this.combineMultiplePositionalIndexesInDisk(this.name, blockCount)
        } else {
            this.combineMultiplePositionalIndexesInDisk(this.name + "-phrase", blockCount)
        }
    }

    constructNGramIndex(){
        let terms = this.dictionary.constructTermsFromDictionary(2)
        this.biGramDictionary = new TermDictionary(this.comparator, terms)
        this.biGramIndex = new NGramIndex(this.biGramDictionary, terms, this.comparator)
        terms = this.dictionary.constructTermsFromDictionary(3)
        this.triGramDictionary = new TermDictionary(this.comparator, terms)
        this.triGramIndex = new NGramIndex(this.triGramDictionary, terms, this.comparator)
    }

    topNString(N: number): string{
        return this.categoryTree.topNString(this.dictionary, N)
    }

    searchCollection(query: Query,
                     searchParameter: SearchParameter): QueryResult{
        switch (this.indexType){
            case IndexType.INCIDENCE_MATRIX:
                return this.incidenceMatrix.search(query, this.dictionary)
            case IndexType.INVERTED_INDEX:
                switch (searchParameter.getRetrievalType()){
                    case    RetrievalType.BOOLEAN:return this.invertedIndex.search(query, this.dictionary)
                    case RetrievalType.POSITIONAL:return this.positionalIndex.positionalSearch(query, this.dictionary)
                    case     RetrievalType.RANKED:return this.positionalIndex.rankedSearch(query,
                        this.dictionary,
                        this.documents,
                        searchParameter.getTermWeighting(),
                        searchParameter.getDocumentWeighting(),
                        searchParameter.getDocumentsRetrieved())
                }
        }
        return new QueryResult()
    }
}