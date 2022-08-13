import {TermDictionary} from "./TermDictionary";
import {TermOccurrence} from "./TermOccurrence";
import {Query} from "../Query/Query";
import {QueryResult} from "../Query/QueryResult";

export class IncidenceMatrix {

    private readonly incidenceMatrix: Array<Array<boolean>> = new Array<Array<boolean>>()
    private readonly dictionarySize: number
    private readonly documentSize: number

    constructor(documentSize: number, termsOrSize: any, dictionary?: TermDictionary){
        this.documentSize = documentSize
        if (dictionary == undefined){
            this.dictionarySize = <number> termsOrSize
            for (let i = 0; i < this.dictionarySize; i++){
                this.incidenceMatrix.push(new Array<boolean>())
            }
        } else {
            if (termsOrSize instanceof Array){
                this.dictionarySize = dictionary.size()
                for (let i = 0; i < this.dictionarySize; i++){
                    this.incidenceMatrix.push(new Array<boolean>())
                }
                let terms = <Array<TermOccurrence>> termsOrSize
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
        }
    }

    set(row: number, col: number){
        this.incidenceMatrix[row][col] = true
    }

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