import {TermDictionary} from "./TermDictionary";
import {TermOccurrence} from "./TermOccurrence";
import {Query} from "../Query/Query";
import {QueryResult} from "../Query/QueryResult";

export class IncidenceMatrix {

    private readonly incidenceMatrix: Array<Array<boolean>> = new Array<Array<boolean>>()
    private dictionarySize: number
    private readonly documentSize: number

    /**
     * Empty constructor for the incidence matrix representation. Initializes the incidence matrix according to the
     * given dictionary and document size.
     * @param dictionarySize Number of words in the dictionary (number of distinct words in the collection)
     */
    constructor1(dictionarySize: number) {
        this.dictionarySize = dictionarySize
        for (let i = 0; i < this.dictionarySize; i++){
            this.incidenceMatrix.push(new Array<boolean>())
        }
    }

    /**
     * Constructs an incidence matrix from a list of sorted tokens in the given terms array.
     * @param dictionary Term dictionary
     * @param terms List of tokens in the memory collection.
     */
    constructor2(terms: Array<TermOccurrence>, dictionary: TermDictionary) {
        this.dictionarySize = dictionary.size()
        for (let i = 0; i < this.dictionarySize; i++){
            this.incidenceMatrix.push(new Array<boolean>())
        }
        if (terms.length > 0){
            let term = terms[0]
            let i = 1
            this.set(dictionary.getWordIndex(term.getTerm().getName()), term.getDocId())
            while (i < terms.length){
                term = terms[i]
                this.set(dictionary.getWordIndex(term.getTerm().getName()), term.getDocId())
                i++;
            }
        }
    }

    constructor(documentSize: number, termsOrSize: any, dictionary?: TermDictionary){
        this.documentSize = documentSize
        if (dictionary == undefined){
            this.constructor1(termsOrSize)
        } else {
            if (termsOrSize instanceof Array){
                this.constructor2(termsOrSize, dictionary)
            }
        }
    }

    /**
     * Sets the given cell in the incidence matrix to true.
     * @param row Row no of the cell
     * @param col Column no of the cell
     */
    set(row: number, col: number){
        this.incidenceMatrix[row][col] = true
    }

    /**
     * Searches a given query in the document collection using incidence matrix boolean search.
     * @param query Query string
     * @param dictionary Term dictionary
     * @return The result of the query obtained by doing incidence matrix boolean search in the collection.
     */
    search(query: Query, dictionary: TermDictionary){
        let result = new QueryResult()
        let resultRow = new Array<boolean>()
        for (let i = 0; i < this.documentSize; i++){
            resultRow.push(true)
        }
        for (let i = 0; i < query.size(); i++){
            let termIndex = dictionary.getWordIndex(query.getTerm(i).getName())
            if (termIndex != -1){
                for (let j = 0; j < this.documentSize; j++){
                    resultRow[j] = resultRow[j] && this.incidenceMatrix[termIndex][j]
                }
            } else {
                return result
            }
        }
        for (let i = 0; i < this.documentSize; i++){
            if (resultRow[i]){
                result.add(i)
            }
        }
        return result
    }

}