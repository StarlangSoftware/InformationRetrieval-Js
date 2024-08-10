import { PostingList } from "./PostingList";
import { TermDictionary } from "./TermDictionary";
import { TermOccurrence } from "./TermOccurrence";
import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import { Query } from "../Query/Query";
import { QueryResult } from "../Query/QueryResult";
export declare class InvertedIndex {
    private index;
    /**
     * Constructs an inverted index from a list of sorted tokens. The terms array should be sorted before calling this
     * method. Multiple occurrences of the same term from the same document are merged in the index. Instances of the
     * same term are then grouped, and the result is split into a postings list.
     * @param dictionary Term dictionary
     * @param terms Sorted list of tokens in the memory collection.
     * @param comparator Comparator method to compare two terms.
     */
    constructor1(dictionary: TermDictionary, terms: Array<TermOccurrence>, comparator: WordComparator): void;
    /**
     * Reads the inverted index from an input file.
     * @param fileName Input file name for the inverted index.
     */
    constructor2(fileName: string): void;
    constructor(dictionaryOrFileName?: any, terms?: Array<TermOccurrence>, comparator?: WordComparator);
    /**
     * Reads the postings list of the inverted index from an input file. The postings are stored in two lines. The first
     * line contains the term id and the number of postings for that term. The second line contains the postings
     * list for that term.
     * @param fileName Inverted index file.
     */
    readPostingList(fileName: string): void;
    keyComparator: (a: (string | number)[], b: (string | number)[]) => 1 | -1 | 0;
    saveSorted(fileName: string): void;
    /**
     * Saves the inverted index into the index file. The postings are stored in two lines. The first
     * line contains the term id and the number of postings for that term. The second line contains the postings
     * list for that term.
     * @param fileName Index file name. Real index file name is created by attaching -postings.txt to this
     *                 file name
     */
    save(fileName: string): void;
    /**
     * Adds a possible new term with a document id to the inverted index. First the term is searched in the hash map,
     * then the document id is put into the correct postings list.
     * @param termId Id of the term
     * @param docId Document id in which the term exists
     */
    add(termId: number, docId: number): void;
    /**
     * Comparator method to compare two posting lists.
     * @param listA the first posting list to be compared.
     * @param listB the second posting list to be compared.
     * @return 1 if the size of the first posting list is larger than the second one, -1 if the size
     * of the first posting list is smaller than the second one, 0 if they are the same.
     */
    postingListComparator: (listA: PostingList, listB: PostingList) => 1 | -1 | 0;
    /**
     * Constructs a sorted array list of frequency counts for a word list and also sorts the word list according to
     * those frequencies.
     * @param wordList Word list for which frequency array is constructed.
     * @param dictionary Term dictionary
     */
    autoCompleteWord(wordList: Array<string>, dictionary: TermDictionary): void;
    /**
     * Searches a given query in the document collection using inverted index boolean search.
     * @param query Query string
     * @param dictionary Term dictionary
     * @return The result of the query obtained by doing inverted index boolean search in the collection.
     */
    search(query: Query, dictionary: TermDictionary): QueryResult;
}
