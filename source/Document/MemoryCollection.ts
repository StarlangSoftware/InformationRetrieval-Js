import {IndexType} from "./IndexType";
import {TermDictionary} from "../Index/TermDictionary";
import {IncidenceMatrix} from "../Index/IncidenceMatrix";
import {NGramIndex} from "../Index/NGramIndex";
import {InvertedIndex} from "../Index/InvertedIndex";
import {PositionalIndex} from "../Index/PositionalIndex";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import {Parameter} from "./Parameter";
import {TermType} from "../Index/TermType";
import * as fs from "fs";
import {TermOccurrence} from "../Index/TermOccurrence";
import {Query} from "../Query/Query";
import {RetrievalType} from "../Query/RetrievalType";
import {QueryResult} from "../Query/QueryResult";
import {SearchParameter} from "../Query/SearchParameter";
import {DocumentType} from "./DocumentType";
import {CategoryTree} from "../Index/CategoryTree";
import {CategoryNode} from "../Index/CategoryNode";
import {FocusType} from "../Query/FocusType";
import {AbstractCollection} from "./AbstractCollection";

export class MemoryCollection extends AbstractCollection{

    private readonly indexType: IndexType

    constructor(directory: string, parameter: Parameter) {
        super(directory, parameter)
        this.indexType = parameter.getIndexType()
        if (parameter.loadIndexesFromFile()){
            this.loadIndexesFromFile(directory)
        } else {
            this.constructIndexesInMemory()
        }
        if (parameter.getDocumentType() == DocumentType.CATEGORICAL){
            this.positionalIndex.setCategoryCounts(this.documents)
            this.categoryTree.setRepresentativeCount(parameter.getRepresentativeCount())
        }
    }

    loadIndexesFromFile(directory: string){
        this.dictionary = new TermDictionary(this.comparator, directory)
        this.invertedIndex = new InvertedIndex(directory)
        if (this.parameter.constructPositionalIndex()){
            this.positionalIndex = new PositionalIndex(directory)
            this.positionalIndex.setDocumentSizes(this.documents)
        }
        if (this.parameter.constructPhraseIndex()){
            this.phraseDictionary = new TermDictionary(this.comparator, directory + "-phrase")
            this.phraseIndex = new InvertedIndex(directory + "-phrase")
            if (this.parameter.constructPositionalIndex()){
                this.phrasePositionalIndex = new PositionalIndex(directory + "-phrase")
            }
        }
        if (this.parameter.constructNGramIndex()){
            this.biGramDictionary = new TermDictionary(this.comparator, directory + "-biGram")
            this.triGramDictionary = new TermDictionary(this.comparator, directory + "-triGram")
            this.biGramIndex = new NGramIndex(directory + "-biGram")
            this.triGramIndex = new NGramIndex(directory + "-triGram")
        }
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

    attributeSearch(query: Query): QueryResult{
        let termAttributes = new Query()
        let phraseAttributes = new Query()
        let termResult = new QueryResult(), phraseResult = new QueryResult()
        query.filterAttributes(this.attributeList, termAttributes, phraseAttributes)
        if (termAttributes.size() > 0){
            termResult = this.invertedIndex.search(termAttributes, this.dictionary)
        }
        if (phraseAttributes.size() > 0){
            phraseResult = this.phraseIndex.search(phraseAttributes, this.phraseDictionary)
        }
        if (termAttributes.size() == 0){
            return phraseResult
        }
        if (phraseAttributes.size() == 0){
            return termResult
        }
        return termResult.intersection(phraseResult)
    }

    searchWithInvertedIndex(query: Query, searchParameter: SearchParameter): QueryResult{
        switch (searchParameter.getRetrievalType()){
            case    RetrievalType.BOOLEAN:
                return this.invertedIndex.search(query, this.dictionary)
            case RetrievalType.POSITIONAL:
                return this.positionalIndex.positionalSearch(query, this.dictionary)
            case     RetrievalType.RANKED:
                return this.positionalIndex.rankedSearch(query,
                this.dictionary,
                this.documents,
                searchParameter.getTermWeighting(),
                searchParameter.getDocumentWeighting(),
                searchParameter.getDocumentsRetrieved())
            case RetrievalType.ATTRIBUTE:
                return this.attributeSearch(query)
        }
        return new QueryResult()
    }

    filterAccordingToCategories(currentResult: QueryResult, categories: Array<CategoryNode>): QueryResult{
        let filteredResult = new QueryResult()
        let items = currentResult.getItems()
        for (let queryResultItem of items) {
            let categoryNode = this.documents[queryResultItem.getDocId()].getCategoryNode()
            for (let possibleAncestor of categories){
                if (categoryNode.isDescendant(possibleAncestor)) {
                    filteredResult.add(queryResultItem.getDocId(), queryResultItem.getScore())
                    break
                }
            }
        }
        return filteredResult
    }

    autoCompleteWord(prefix: string): Array<string>{
        let result = new Array<string>();
        let i = this.dictionary.getWordStartingWith(prefix)
        if (i < 0){
            i = -(i + 1)
        }
        while (i < this.dictionary.size()){
            if (this.dictionary.getWord(i).getName().startsWith(prefix)){
                result.push(this.dictionary.getWord(i).getName())
            } else {
                break
            }
            i++
        }
        this.invertedIndex.autoCompleteWord(result, this.dictionary)
        return result
    }

    searchCollection(query: Query,
                     searchParameter: SearchParameter): QueryResult{
        if (searchParameter.getFocusType() == FocusType.CATEGORY){
            let currentResult = this.searchWithInvertedIndex(query, searchParameter)
            let categories = this.categoryTree.getCategories(query, this.dictionary, searchParameter.getCategoryDeterminationType())
            return this.filterAccordingToCategories(currentResult, categories)
        } else {
            switch (this.indexType){
                case IndexType.INCIDENCE_MATRIX:
                    return this.incidenceMatrix.search(query, this.dictionary)
                case IndexType.INVERTED_INDEX:
                    return this.searchWithInvertedIndex(query, searchParameter)
            }
        }
        return new QueryResult()
    }
}