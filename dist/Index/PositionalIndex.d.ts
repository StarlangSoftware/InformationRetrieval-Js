import { TermOccurrence } from "./TermOccurrence";
import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import { TermDictionary } from "./TermDictionary";
import { Query } from "../Query/Query";
import { QueryResult } from "../Query/QueryResult";
import { Document } from "../Document/Document";
import { SearchParameter } from "../Query/SearchParameter";
export declare class PositionalIndex {
    private positionalIndex;
    /**
     * Constructs a positional inverted index from a list of sorted tokens. The terms array should be sorted before
     * calling this method. Multiple occurrences of the same term from the same document are enlisted separately in the
     * index.
     * @param dictionary Term dictionary
     * @param terms Sorted list of tokens in the memory collection.
     * @param comparator Comparator method to compare two terms.
     */
    constructor1(dictionary: TermDictionary, terms: Array<TermOccurrence>, comparator: WordComparator): void;
    /**
     * Reads the positional inverted index from an input file.
     * @param fileName Input file name for the positional inverted index.
     */
    constructor2(fileName: string): void;
    constructor(dictionaryOrFileName?: any, terms?: Array<TermOccurrence>, comparator?: WordComparator);
    /**
     * Reads the positional postings list of the positional index from an input file. The postings are stored in n
     * lines. The first line contains the term id and the number of documents that term occurs. Other n - 1 lines
     * contain the postings list for that term for a separate document.
     * @param fileName Positional index file.
     */
    readPositionalPostingList(fileName: string): void;
    keyComparator: (a: (string | number)[], b: (string | number)[]) => 1 | -1 | 0;
    saveSorted(fileName: string): void;
    /**
     * Saves the positional index into the index file. The postings are stored in n lines. The first line contains the
     * term id and the number of documents that term occurs. Other n - 1 lines contain the postings list for that term
     * for a separate document.
     * @param fileName Index file name. Real index file name is created by attaching -positionalPostings.txt to this
     *                 file name
     */
    save(fileName: string): void;
    /**
     * Adds a possible new term with a position and document id to the positional index. First the term is searched in
     * the hash map, then the position and the document id is put into the correct postings list.
     * @param termId Id of the term
     * @param docId Document id in which the term exists
     * @param position Position of the term in the document with id docId
     */
    addPosition(termId: number, docId: number, position: number): void;
    /**
     * Searches a given query in the document collection using positional index boolean search.
     * @param query Query string
     * @param dictionary Term dictionary
     * @return The result of the query obtained by doing positional index boolean search in the collection.
     */
    positionalSearch(query: Query, dictionary: TermDictionary): QueryResult;
    /**
     * Returns the term frequencies  in a given document.
     * @param docId Id of the document
     * @return Term frequencies of the given document.
     */
    getTermFrequencies(docId: number): Array<number>;
    /**
     * Returns the document frequencies of the terms in the collection.
     * @return The document frequencies of the terms in the collection.
     */
    getDocumentFrequencies(): Array<number>;
    /**
     * Calculates and sets the number of terms in each document in the document collection.
     * @param documents Document collection.
     */
    setDocumentSizes(documents: Array<Document>): void;
    /**
     * Calculates and updates the frequency counts of the terms in each category node.
     * @param documents Document collection.
     */
    setCategoryCounts(documents: Array<Document>): void;
    /**
     * Searches a given query in the document collection using inverted index ranked search.
     * @param query Query string
     * @param dictionary Term dictionary
     * @param documents Document collection
     * @param parameter Search parameter
     * @return The result of the query obtained by doing inverted index ranked search in the collection.
     */
    rankedSearch(query: Query, dictionary: TermDictionary, documents: Array<Document>, parameter: SearchParameter): QueryResult;
}
