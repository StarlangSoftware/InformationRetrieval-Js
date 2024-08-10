import { TermDictionary } from "../Index/TermDictionary";
import { Document } from "./Document";
import { IncidenceMatrix } from "../Index/IncidenceMatrix";
import { InvertedIndex } from "../Index/InvertedIndex";
import { NGramIndex } from "../Index/NGramIndex";
import { PositionalIndex } from "../Index/PositionalIndex";
import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import { Parameter } from "./Parameter";
import { CategoryTree } from "../Index/CategoryTree";
export declare class AbstractCollection {
    protected dictionary: TermDictionary;
    protected phraseDictionary: TermDictionary;
    protected biGramDictionary: TermDictionary;
    protected triGramDictionary: TermDictionary;
    protected documents: Array<Document>;
    protected incidenceMatrix: IncidenceMatrix;
    protected invertedIndex: InvertedIndex;
    protected biGramIndex: NGramIndex;
    protected triGramIndex: NGramIndex;
    protected positionalIndex: PositionalIndex;
    protected phraseIndex: InvertedIndex;
    protected phrasePositionalIndex: PositionalIndex;
    protected readonly comparator: WordComparator;
    protected readonly name: string;
    protected parameter: Parameter;
    protected categoryTree: CategoryTree;
    protected attributeList: Set<string>;
    /**
     * Constructor for the AbstractCollection class. All collections, disk, memory, large, medium are extended from this
     * basic class. Loads the attribute list from attribute file if required. Loads the names of the documents from
     * the document collection. If the collection is a categorical collection, also loads the category tree.
     * @param directory Directory where the document collection resides.
     * @param parameter Search parameter
     */
    constructor(directory: string, parameter: Parameter);
    /**
     * Loads the attribute list from attribute index file. Attributes are single or bi-word phrases representing the
     * important features of products in the collection. Each line of the attribute file contains either single or a two
     * word expression.
     */
    loadAttributeList(): void;
    getLine(filesData: Array<Array<string>>, files: Array<number>, index: number): string;
    getLines(filesData: Array<Array<string>>, files: Array<number>, index: number, lineCount: number): string[];
    /**
     * Loads the category tree for the categorical collections from category index file. Each line of the category index
     * file stores the index of the category and the category name with its hierarchy. Hierarchy string is obtained by
     * concatenating the names of all nodes in the path from root node to a leaf node separated with '%'.
     */
    loadCategories(): void;
    /**
     * Returns size of the document collection.
     * @return Size of the document collection.
     */
    size(): number;
    /**
     * Returns size of the term dictionary.
     * @return Size of the term dictionary.
     */
    vocabularySize(): number;
    /**
     * Constructs bi-gram and tri-gram indexes in memory.
     */
    constructNGramIndex(): void;
}
