import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import { Parameter } from "./Parameter";
import { TermType } from "../Index/TermType";
import { TermOccurrence } from "../Index/TermOccurrence";
import { Query } from "../Query/Query";
import { QueryResult } from "../Query/QueryResult";
import { SearchParameter } from "../Query/SearchParameter";
import { CategoryNode } from "../Index/CategoryNode";
import { AbstractCollection } from "./AbstractCollection";
export declare class MemoryCollection extends AbstractCollection {
    private readonly indexType;
    /**
     * Constructor for the MemoryCollection class. In small collections, dictionary and indexes are kept in memory.
     * Memory collection also supports categorical documents.
     * @param directory Directory where the document collection resides.
     * @param parameter Search parameter
     */
    constructor(directory: string, parameter: Parameter);
    /**
     * The method loads the term dictionary, inverted index, positional index, phrase and N-Gram indexes from dictionary
     * and index files to the memory.
     * @param directory Directory where the document collection resides.
     */
    loadIndexesFromFile(directory: string): void;
    /**
     * The method saves the term dictionary, inverted index, positional index, phrase and N-Gram indexes to the dictionary
     * and index files. If the collection is a categorical collection, categories are also saved to the category
     * files.
     */
    save(): void;
    /**
     * The method saves the category tree for the categorical collections.
     */
    saveCategories(): void;
    /**
     * The method constructs the term dictionary, inverted index, positional index, phrase and N-Gram indexes in memory.
     */
    constructIndexesInMemory(): void;
    termComparator: (comparator: WordComparator) => (termA: TermOccurrence, termB: TermOccurrence) => number;
    /**
     * Given the document collection, creates an array list of terms. If term type is TOKEN, the terms are single
     * word, if the term type is PHRASE, the terms are bi-words. Each document is loaded into memory and
     * word list is created. Since the dictionary can be kept in memory, all operations can be done in memory.
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     * @return Array list of terms occurring in the document collection.
     */
    constructTerms(termType: TermType): Array<TermOccurrence>;
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
    attributeSearch(query: Query, parameter: SearchParameter): QueryResult;
    /**
     * The method searches given query string in the document collection using the inverted index according to the
     * given search parameter. If the search is (i) boolean, inverted index is used (ii) positional, positional
     * inverted index is used, (iii) ranked, positional inverted index is used with a ranking algorithm at the end.
     * @param query Query string
     * @param searchParameter Search parameter for the query
     * @return The intermediate result of the query obtained by doing inverted index based search in the collection.
     */
    searchWithInvertedIndex(query: Query, searchParameter: SearchParameter): QueryResult;
    /**
     * Filters current search result according to the predicted categories from the query string. For every search
     * result, if it is in one of the predicated categories, is added to the filtered end result. Otherwise, it is
     * omitted in the end result.
     * @param currentResult Current search result before filtering.
     * @param categories Predicted categories that match the query string.
     * @return Filtered query result
     */
    filterAccordingToCategories(currentResult: QueryResult, categories: Array<CategoryNode>): QueryResult;
    /**
     * Constructs an auto complete list of product names for a given prefix. THe results are sorted according to
     * frequencies.
     * @param prefix Prefix of the name of the product.
     * @return An auto complete list of product names for a given prefix.
     */
    autoCompleteWord(prefix: string): Array<string>;
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
    searchCollection(query: Query, searchParameter: SearchParameter): QueryResult;
}
