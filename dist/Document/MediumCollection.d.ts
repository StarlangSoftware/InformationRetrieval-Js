import { DiskCollection } from "./DiskCollection";
import { Parameter } from "./Parameter";
import { TermType } from "../Index/TermType";
import { TermDictionary } from "../Index/TermDictionary";
export declare class MediumCollection extends DiskCollection {
    /**
     * Constructor for the MediumCollection class. In medium collections, dictionary is kept in memory and indexes are
     * stored in the disk and don't fit in memory in their construction phase and usage phase. For that reason, in their
     * construction phase, multiple disk reads and optimizations are needed.
     * @param directory Directory where the document collection resides.
     * @param parameter Search parameter
     */
    constructor(directory: string, parameter: Parameter);
    /**
     * In block sort based indexing, the indexes are created in a block wise manner. They do not fit in memory, therefore
     * documents are read one by one. According to the search parameter, inverted index, positional index, phrase
     * indexes, N-Gram indexes are constructed in disk.
     */
    constructIndexesInDisk(): void;
    /**
     * Given the document collection, creates a hash set of distinct terms. If term type is TOKEN, the terms are single
     * word, if the term type is PHRASE, the terms are bi-words. Each document is loaded into memory and distinct
     * word list is created. Since the dictionary can be kept in memory, all operations can be done in memory.
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     * @return Hash set of terms occurring in the document collection.
     */
    constructDistinctWordList(termType: TermType): Set<string>;
    /**
     * In block sort based indexing, the inverted index is created in a block wise manner. It does not fit in memory,
     * therefore documents are read one by one. For each document, the terms are added to the inverted index. If the
     * number of documents read are above the limit, current partial inverted index file is saved and new inverted index
     * file is open. After reading all documents, we combine the inverted index files to get the final inverted index
     * file.
     * @param dictionary Term dictionary.
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     */
    constructInvertedIndexInDisk(dictionary: TermDictionary, termType: TermType): void;
    /**
     * In block sort based indexing, the positional index is created in a block wise manner. It does not fit in memory,
     * therefore documents are read one by one. For each document, the terms are added to the positional index. If the
     * number of documents read are above the limit, current partial positional index file is saved and new positional
     * index file is open. After reading all documents, we combine the posiitonal index files to get the final
     * positional index file.
     * @param dictionary Term dictionary.
     * @param termType If term type is TOKEN, the terms are single word, if the term type is PHRASE, the terms are
     *                 bi-words.
     */
    constructPositionalIndexInDisk(dictionary: TermDictionary, termType: TermType): void;
}
