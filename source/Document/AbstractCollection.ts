import {TermDictionary} from "../Index/TermDictionary";
import {Document} from "./Document";
import {DocumentType} from "./DocumentType";
import {IncidenceMatrix} from "../Index/IncidenceMatrix";
import {InvertedIndex} from "../Index/InvertedIndex";
import {NGramIndex} from "../Index/NGramIndex";
import {PositionalIndex} from "../Index/PositionalIndex";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import {Parameter} from "./Parameter";
import {CategoryTree} from "../Index/CategoryTree";
import * as fs from "fs";

export class AbstractCollection {

    protected dictionary: TermDictionary
    protected phraseDictionary: TermDictionary
    protected biGramDictionary: TermDictionary
    protected triGramDictionary: TermDictionary
    protected documents: Array<Document> = new Array<Document>()
    protected incidenceMatrix: IncidenceMatrix
    protected invertedIndex: InvertedIndex
    protected biGramIndex: NGramIndex
    protected triGramIndex: NGramIndex
    protected positionalIndex: PositionalIndex
    protected phraseIndex: InvertedIndex
    protected phrasePositionalIndex: PositionalIndex
    protected readonly comparator: WordComparator
    protected readonly name: string
    protected parameter: Parameter
    protected categoryTree: CategoryTree
    protected attributeList: Set<string> = new Set<string>()

    constructor(directory: string, parameter: Parameter){
        this.name = directory
        this.comparator = parameter.getWordComparator()
        this.parameter = parameter
        if (parameter.getDocumentType() == DocumentType.CATEGORICAL) {
            this.loadAttributeList()
        }
        let files = fs.readdirSync(directory)
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
        if (parameter.getDocumentType() == DocumentType.CATEGORICAL) {
            this.loadCategories()
        }
    }

    loadAttributeList(){
        let lines = fs.readFileSync(this.name + "-attributelist.txt", "utf-8").split('\n')
        for (let line of lines){
            if (line != ""){
                this.attributeList.add(line)
            }
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

    size(): number{
        return this.documents.length
    }

    vocabularySize(): number{
        return this.dictionary.size()
    }

    constructNGramIndex(){
        let terms = this.dictionary.constructTermsFromDictionary(2)
        this.biGramDictionary = new TermDictionary(this.comparator, terms)
        this.biGramIndex = new NGramIndex(this.biGramDictionary, terms, this.comparator)
        terms = this.dictionary.constructTermsFromDictionary(3)
        this.triGramDictionary = new TermDictionary(this.comparator, terms)
        this.triGramIndex = new NGramIndex(this.triGramDictionary, terms, this.comparator)
    }

}