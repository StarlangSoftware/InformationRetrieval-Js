import { TermDictionary } from "./TermDictionary";
import { TermOccurrence } from "./TermOccurrence";
import { Query } from "../Query/Query";
import { QueryResult } from "../Query/QueryResult";
export declare class IncidenceMatrix {
    private readonly incidenceMatrix;
    private dictionarySize;
    private readonly documentSize;
    /**
     * Empty constructor for the incidence matrix representation. Initializes the incidence matrix according to the
     * given dictionary and document size.
     * @param dictionarySize Number of words in the dictionary (number of distinct words in the collection)
     */
    constructor1(dictionarySize: number): void;
    /**
     * Constructs an incidence matrix from a list of sorted tokens in the given terms array.
     * @param dictionary Term dictionary
     * @param terms List of tokens in the memory collection.
     */
    constructor2(terms: Array<TermOccurrence>, dictionary: TermDictionary): void;
    constructor(documentSize: number, termsOrSize: any, dictionary?: TermDictionary);
    /**
     * Sets the given cell in the incidence matrix to true.
     * @param row Row no of the cell
     * @param col Column no of the cell
     */
    set(row: number, col: number): void;
    /**
     * Searches a given query in the document collection using incidence matrix boolean search.
     * @param query Query string
     * @param dictionary Term dictionary
     * @return The result of the query obtained by doing incidence matrix boolean search in the collection.
     */
    search(query: Query, dictionary: TermDictionary): QueryResult;
}
