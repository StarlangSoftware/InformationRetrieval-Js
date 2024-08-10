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

export class MemoryCollection extends AbstractCollection {

    private readonly indexType: IndexType

    /**
     * Constructor for the MemoryCollection class. In small collections, dictionary and indexes are kept in memory.
     * Memory collection also supports categorical documents.
     * @param directory Directory where the document collection resides.
     * @param parameter Search parameter
     */
    constructor(directory: string, parameter: Parameter) {
        super(directory, parameter)
        this.indexType = parameter.getIndexType()
        if (parameter.loadIndexesFromFile()) {
            this.loadIndexesFromFile(directory)
        } else {
            this.constructIndexesInMemory()
        }
        if (parameter.getDocumentType() == DocumentType.CATEGORICAL) {
            this.positionalIndex.setCategoryCounts(this.documents)
            this.categoryTree.setRepresentativeCount(parameter.getRepresentativeCount())
        }
    }

    /**
     * The method loads the term dictionary, inverted index, positional index, phrase and N-Gram indexes from dictionary
     * and index files to the memory.
     * @param directory Directory where the document collection resides.
     */
    loadIndexesFromFile(directory: string) {
        this.dictionary = new TermDictionary(this.comparator, directory)
        this.invertedIndex = new InvertedIndex(directory)
        if (this.parameter.constructPositionalIndex()) {
            this.positionalIndex = new PositionalIndex(directory)
            this.positionalIndex.setDocumentSizes(this.documents)
        }
        if (this.parameter.constructPhraseIndex()) {
            this.phraseDictionary = new TermDictionary(this.comparator, directory + "-phrase")
            this.phraseIndex = new InvertedIndex(directory + "-phrase")
            if (this.parameter.constructPositionalIndex()) {
                this.phrasePositionalIndex = new PositionalIndex(directory + "-phrase")
            }
        }
        if (this.parameter.constructNGramIndex()) {
            this.biGramDictionary = new TermDictionary(this.comparator, directory + "-biGram")
            this.triGramDictionary = new TermDictionary(this.comparator, directory + "-triGram")
            this.biGramIndex = new NGramIndex(directory + "-biGram")
            this.triGramIndex = new NGramIndex(directory + "-triGram")
        }
    }

    /**
     * The method saves the term dictionary, inverted index, positional index, phrase and N-Gram indexes to the dictionary
     * and index files. If the collection is a categorical collection, categories are also saved to the category
     * files.
     */
    save() {
        if (this.indexType == IndexType.INVERTED_INDEX) {
            this.dictionary.save(this.name)
            this.invertedIndex.save(this.name);
            if (this.parameter.constructPositionalIndex()) {
                this.positionalIndex.save(this.name)
            }
            if (this.parameter.constructPhraseIndex()) {
                this.phraseDictionary.save(this.name + "-phrase")
                this.phraseIndex.save(this.name + "-phrase")
                if (this.parameter.constructPositionalIndex()) {
                    this.phrasePositionalIndex.save(this.name + "-phrase")
                }
            }
            if (this.parameter.constructNGramIndex()) {
                this.biGramDictionary.save(this.name + "-biGram")
                this.triGramDictionary.save(this.name + "-triGram")
                this.biGramIndex.save(this.name + "-biGram")
                this.triGramIndex.save(this.name + "-triGram")
            }
        }
        if (this.parameter.getDocumentType() == DocumentType.CATEGORICAL) {
            this.saveCategories()
        }
    }

    /**
     * The method saves the category tree for the categorical collections.
     */
    saveCategories() {
        let output = ""
        for (let document of this.documents) {
            output = output + document.getDocId() + "\t" + document.getCategory().toString() + "\n"
        }
        fs.writeFileSync(this.name + "-categories.txt", output, "utf-8")
    }

    /**
     * The method constructs the term dictionary, inverted index, positional index, phrase and N-Gram indexes in memory.
     */
    constructIndexesInMemory() {
        let terms = this.constructTerms(TermType.TOKEN);
        this.dictionary = new TermDictionary(this.comparator, terms);
        switch (this.indexType) {
            case IndexType.INCIDENCE_MATRIX:
                this.incidenceMatrix = new IncidenceMatrix(this.documents.length, terms, this.dictionary)
                break;
            case IndexType.INVERTED_INDEX:
                this.invertedIndex = new InvertedIndex(this.dictionary, terms, this.comparator)
                if (this.parameter.constructPositionalIndex()) {
                    this.positionalIndex = new PositionalIndex(this.dictionary, terms, this.comparator)
                }
                if (this.parameter.constructPhraseIndex()) {
                    terms = this.constructTerms(TermType.PHRASE)
                    this.phraseDictionary = new TermDictionary(this.comparator, terms)
                    this.phraseIndex = new InvertedIndex(this.phraseDictionary, terms, this.comparator)
                    if (this.parameter.constructPositionalIndex()) {
                        this.phrasePositionalIndex = new PositionalIndex(this.phraseDictionary, terms, this.comparator)
                    }
                }
                if (this.parameter.constructNGramIndex()) {
                    this.constructNGramIndex()
                }
                if (this.parameter.getDocumentType() == DocumentType.CATEGORICAL) {
                    this.categoryTree = new CategoryTree(this.name);
                    for (let document of this.documents) {
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

    /**
     * Given the document collection, creates an array list of terms. If term type is TOKEN, the terms are single
     * word, if the term type is PHRASE, the terms are bi-words. Each document is loaded into memory and
     * word list is created. Since the dictionary can be kept in memory, all operations can be done in memory.
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     * @return Array list of terms occurring in the document collection.
     */
    constructTerms(termType: TermType): Array<TermOccurrence> {
        let terms = new Array<TermOccurrence>()
        for (let doc of this.documents) {
            let documentText = doc.loadDocument()
            let docTerms = documentText.constructTermList(doc.getDocId(), termType)
            terms = terms.concat(docTerms)
        }
        terms.sort(this.termComparator(this.comparator))
        return terms;
    }

    /**
     * The method searches given query string in the document collection using the attribute list according to the
     * given search parameter. First, the original query is filtered by removing phrase attributes, shortcuts and single
     * word attributes. At this stage, we get the word and phrase attributes in the original query and the remaining
     * words in the original query as two separate queries. Second, both single word and phrase attributes in the
     * original query are searched in the document collection. Third, these intermediate query results are then
     * intersected. Fourth, we put this results into either (i) an inverted index (ii) or a ranked based positional
     * filtering with the filtered query to get the end result.
     * @param query Query string
     * @param parameter Search parameter for the query
     * @return The intermediate result of the query obtained by doing attribute list based search in the collection.
     */
    attributeSearch(query: Query, parameter: SearchParameter): QueryResult {
        let termAttributes = new Query()
        let phraseAttributes = new Query()
        let termResult = new QueryResult(), phraseResult = new QueryResult()
        let attributeResult, filteredResult
        let filteredQuery = query.filterAttributes(this.attributeList, termAttributes, phraseAttributes)
        if (termAttributes.size() > 0) {
            termResult = this.invertedIndex.search(termAttributes, this.dictionary)
        }
        if (phraseAttributes.size() > 0) {
            phraseResult = this.phraseIndex.search(phraseAttributes, this.phraseDictionary)
        }
        if (termAttributes.size() == 0) {
            attributeResult = phraseResult
        } else {
            if (phraseAttributes.size() == 0) {
                attributeResult = termResult
            } else {
                attributeResult = termResult.intersectionFastSearch(phraseResult)
            }
        }
        if (filteredQuery.size() == 0) {
            return attributeResult
        } else {
            if (parameter.getRetrievalType() != RetrievalType.RANKED) {
                filteredResult = this.searchWithInvertedIndex(filteredQuery, parameter);
                return filteredResult.intersectionFastSearch(attributeResult)
            } else {
                filteredResult = this.positionalIndex.rankedSearch(filteredQuery,
                    this.dictionary,
                    this.documents,
                    parameter);
                if (attributeResult.size() < 10) {
                    filteredResult = filteredResult.intersectionLinearSearch(attributeResult)
                } else {
                    filteredResult = filteredResult.intersectionBinarySearch(attributeResult)
                }
                filteredResult.getBest(parameter.getDocumentsRetrieved());
                return filteredResult;
            }
        }
    }

    /**
     * The method searches given query string in the document collection using the inverted index according to the
     * given search parameter. If the search is (i) boolean, inverted index is used (ii) positional, positional
     * inverted index is used, (iii) ranked, positional inverted index is used with a ranking algorithm at the end.
     * @param query Query string
     * @param searchParameter Search parameter for the query
     * @return The intermediate result of the query obtained by doing inverted index based search in the collection.
     */
    searchWithInvertedIndex(query: Query, searchParameter: SearchParameter): QueryResult {
        switch (searchParameter.getRetrievalType()) {
            case    RetrievalType.BOOLEAN:
                return this.invertedIndex.search(query, this.dictionary)
            case RetrievalType.POSITIONAL:
                return this.positionalIndex.positionalSearch(query, this.dictionary)
            case     RetrievalType.RANKED:
                let result = this.positionalIndex.rankedSearch(query,
                    this.dictionary,
                    this.documents,
                    searchParameter);
                result.getBest(searchParameter.getDocumentsRetrieved());
                return result;
        }
        return new QueryResult()
    }

    /**
     * Filters current search result according to the predicted categories from the query string. For every search
     * result, if it is in one of the predicated categories, is added to the filtered end result. Otherwise, it is
     * omitted in the end result.
     * @param currentResult Current search result before filtering.
     * @param categories Predicted categories that match the query string.
     * @return Filtered query result
     */
    filterAccordingToCategories(currentResult: QueryResult, categories: Array<CategoryNode>): QueryResult {
        let filteredResult = new QueryResult()
        let items = currentResult.getItems()
        for (let queryResultItem of items) {
            let categoryNode = this.documents[queryResultItem.getDocId()].getCategoryNode()
            for (let possibleAncestor of categories) {
                if (categoryNode.isDescendant(possibleAncestor)) {
                    filteredResult.add(queryResultItem.getDocId(), queryResultItem.getScore())
                    break
                }
            }
        }
        return filteredResult
    }

    /**
     * Constructs an auto complete list of product names for a given prefix. THe results are sorted according to
     * frequencies.
     * @param prefix Prefix of the name of the product.
     * @return An auto complete list of product names for a given prefix.
     */
    autoCompleteWord(prefix: string): Array<string> {
        let result = new Array<string>();
        let i = this.dictionary.getWordStartingWith(prefix)
        if (i < 0) {
            i = -(i + 1)
        }
        while (i < this.dictionary.size()) {
            if (this.dictionary.getWord(i).getName().startsWith(prefix)) {
                result.push(this.dictionary.getWord(i).getName())
            } else {
                break
            }
            i++
        }
        this.invertedIndex.autoCompleteWord(result, this.dictionary)
        return result
    }

    /**
     * Searches a document collection for a given query according to the given search parameters. The documents are
     * searched using (i) incidence matrix if the index type is incidence matrix, (ii) attribute list if search
     * attributes option is selected, (iii) inverted index if the index type is inverted index and no attribute
     * search is done. After the initial search, if there is a categorical focus, it filters the results
     * according to the predicted categories from the query string.
     * @param query Query string
     * @param searchParameter Search parameter for the query
     * @return The result of the query obtained by doing search in the collection.
     */
    searchCollection(query: Query,
                     searchParameter: SearchParameter): QueryResult {
        let currentResult
        if (searchParameter.getFocusType() == FocusType.CATEGORY) {
            if (searchParameter.getSearchAttributes()) {
                currentResult = this.attributeSearch(query, searchParameter)
            } else {
                currentResult = this.searchWithInvertedIndex(query, searchParameter)
            }
            let categories = this.categoryTree.getCategories(query, this.dictionary, searchParameter.getCategoryDeterminationType())
            return this.filterAccordingToCategories(currentResult, categories)
        } else {
            switch (this.indexType) {
                case IndexType.INCIDENCE_MATRIX:
                    return this.incidenceMatrix.search(query, this.dictionary)
                case IndexType.INVERTED_INDEX:
                    if (searchParameter.getSearchAttributes()) {
                        return this.attributeSearch(query, searchParameter);
                    } else {
                        return this.searchWithInvertedIndex(query, searchParameter);
                    }
            }
        }
        return new QueryResult()
    }
}