import { TermDictionary } from "./TermDictionary";
import { Query } from "../Query/Query";
import { QueryResult } from "../Query/QueryResult";
export declare class IncidenceMatrix {
    private readonly incidenceMatrix;
    private readonly dictionarySize;
    private readonly documentSize;
    constructor(documentSize: number, termsOrSize: any, dictionary?: TermDictionary);
    set(row: number, col: number): void;
    search(query: Query, dictionary: TermDictionary): QueryResult;
}
