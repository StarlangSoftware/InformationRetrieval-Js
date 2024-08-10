import { DiskCollection } from "./DiskCollection";
import { Parameter } from "./Parameter";
import { TermType } from "../Index/TermType";
import { TermDictionary } from "../Index/TermDictionary";
import { NGramIndex } from "../Index/NGramIndex";
export declare class LargeCollection extends DiskCollection {
    /**
     * Constructor for the LargeCollection class. In large collections, both dictionary and indexes are stored in the
     * disk and don't fit in memory in their construction phase and usage phase. For that reason, in their construction
     * phase, multiple disk reads and optimizations are needed.
     * @param directory Directory where the document collection resides.
     * @param parameter Search parameter
     */
    constructor(directory: string, parameter: Parameter);
    /**
     * The method constructs the term dictionary and all indexes on disk.
     */
    constructDictionaryAndIndexesInDisk(): void;
    /**
     * In single pass in memory indexing, the dictionary files are merged to get the final dictionary file. This method
     * checks if all parallel dictionaries are combined or not.
     * @param currentWords Current pointers for the words in parallel dictionaries. currentWords[0] is the current word
     *                     in the first dictionary to be combined, currentWords[2] is the current word in the second
     *                     dictionary to be combined etc.
     * @return True, if all merge operation is completed, false otherwise.
     */
    notCombinedAllDictionaries(currentWords: Array<string>): boolean;
    /**
     * In single pass in memory indexing, the dictionary files are merged to get the final dictionary file. This method
     * identifies the dictionaries whose words to be merged are lexicographically the first. They will be selected and
     * combined in the next phase.
     * @param currentWords Current pointers for the words in parallel dictionaries. currentWords[0] is the current word
     *                     in the first dictionary to be combined, currentWords[2] is the current word in the second
     *                     dictionary to be combined etc.
     * @return An array list of indexes for the dictionaries, whose words to be merged are lexicographically the first.
     */
    selectDictionariesWithMinimumWords(currentWords: Array<string>): Array<number>;
    /**
     * In single pass in memory indexing, the dictionary files are merged to get the final dictionary file. This method
     * implements the merging algorithm. Reads the dictionary files in parallel and at each iteration puts the smallest
     * word to the final dictionary. Updates the pointers of the dictionaries accordingly.
     * @param name Name of the collection.
     * @param tmpName Temporary name of the dictionary files.
     * @param blockCount Number of dictionaries to be merged.
     */
    combineMultipleDictionariesInDisk(name: string, tmpName: string, blockCount: number): void;
    /**
     * In single pass in memory indexing, the dictionaries and inverted indexes are created in a block wise manner. They
     * do not fit in memory, therefore documents are read one by one. For each document, the terms are added to the
     * current dictionary and inverted index. If the number of documents read are above the limit, current partial
     * dictionary and inverted index file are saved and new dictionary and inverted index file are open. After reading
     * all  documents, we combine the dictionary and inverted index files to get the final dictionary and inverted index
     * file.
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     */
    constructDictionaryAndInvertedIndexInDisk(termType: TermType): void;
    /**
     * In single pass in memory indexing, the dictionaries and positional indexes are created in a block wise manner.
     * They do not fit in memory, therefore documents are read one by one. For each document, the terms are added to the
     * current dictionary and positional index. If the number of documents read are above the limit, current partial
     * dictionary and positional index file are saved and new dictionary and positional index file are open. After
     * reading all documents, we combine the dictionary and positional index files to get the final dictionary and
     * positional index file.
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     */
    constructDictionaryAndPositionalIndexInDisk(termType: TermType): void;
    hashCode(s: string): number;
    /**
     * The method constructs the N-Grams from the given tokens in a string. The method first identifies the tokens in
     * the line by splitting from space, then constructs N-Grams for those tokens and adds N-Grams to the N-Gram
     * dictionary and N-Gram index.
     * @param line String containing the tokens.
     * @param k N in N-Gram.
     * @param nGramDictionary N-Gram term dictionary
     * @param nGramIndex N-Gram inverted index
     */
    addNGramsToDictionaryAndIndex(line: string, k: number, nGramDictionary: TermDictionary, nGramIndex: NGramIndex): void;
    /**
     * In single pass in memory indexing, the dictionaries and N-gram indexes are created in a block wise manner.
     * They do not fit in memory, therefore documents are read one by one. For each document, the terms are added to the
     * current dictionary and N-gram index. If the number of documents read are above the limit, current partial
     * dictionary and N-gram index file are saved and new dictionary and N-gram index file are open. After
     * reading all documents, we combine the dictionary and N-gram index files to get the final dictionary and
     * N-gram index file.
     */
    constructNGramDictionaryAndIndexInDisk(): void;
}
