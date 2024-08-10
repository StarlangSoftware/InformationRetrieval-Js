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

    /**
     * Constructor for the AbstractCollection class. All collections, disk, memory, large, medium are extended from this
     * basic class. Loads the attribute list from attribute file if required. Loads the names of the documents from
     * the document collection. If the collection is a categorical collection, also loads the category tree.
     * @param directory Directory where the document collection resides.
     * @param parameter Search parameter
     */
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

    /**
     * Loads the attribute list from attribute index file. Attributes are single or bi-word phrases representing the
     * important features of products in the collection. Each line of the attribute file contains either single or a two
     * word expression.
     */
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

    /**
     * Loads the category tree for the categorical collections from category index file. Each line of the category index
     * file stores the index of the category and the category name with its hierarchy. Hierarchy string is obtained by
     * concatenating the names of all nodes in the path from root node to a leaf node separated with '%'.
     */
    loadCategories(){
        this.categoryTree = new CategoryTree(this.name)
        let lines = fs.readFileSync(this.name + "-categories.txt", "utf-8").split('\n')
        for (let line of lines){
            if (line != ""){
                let items = line.split("\t")
                let docId = parseInt(items[0])
                if (items.length > 1){
                    this.documents[docId].setCategory(this.categoryTree, items[1])
                }
            }
        }
    }

    /**
     * Returns size of the document collection.
     * @return Size of the document collection.
     */
    size(): number{
        return this.documents.length
    }

    /**
     * Returns size of the term dictionary.
     * @return Size of the term dictionary.
     */
    vocabularySize(): number{
        return this.dictionary.size()
    }

    /**
     * Constructs bi-gram and tri-gram indexes in memory.
     */
    constructNGramIndex(){
        let terms = this.dictionary.constructTermsFromDictionary(2)
        this.biGramDictionary = new TermDictionary(this.comparator, terms)
        this.biGramIndex = new NGramIndex(this.biGramDictionary, terms, this.comparator)
        terms = this.dictionary.constructTermsFromDictionary(3)
        this.triGramDictionary = new TermDictionary(this.comparator, terms)
        this.triGramIndex = new NGramIndex(this.triGramDictionary, terms, this.comparator)
    }

}