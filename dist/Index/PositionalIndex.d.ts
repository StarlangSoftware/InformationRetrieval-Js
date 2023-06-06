import { TermOccurrence } from "./TermOccurrence";
import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import { TermDictionary } from "./TermDictionary";
import { Query } from "../Query/Query";
import { QueryResult } from "../Query/QueryResult";
import { Document } from "../Document/Document";
import { SearchParameter } from "../Query/SearchParameter";
export declare class PositionalIndex {
    private positionalIndex;
    constructor(dictionaryOrFileName?: any, terms?: Array<TermOccurrence>, comparator?: WordComparator);
    readPositionalPostingList(fileName: string): void;
    keyComparator: (a: (string | number)[], b: (string | number)[]) => 1 | -1 | 0;
    saveSorted(fileName: string): void;
    save(fileName: string): void;
    addPosition(termId: number, docId: number, position: number): void;
    positionalSearch(query: Query, dictionary: TermDictionary): QueryResult;
    getTermFrequencies(docId: number): Array<number>;
    getDocumentFrequencies(): Array<number>;
    setDocumentSizes(documents: Array<Document>): void;
    setCategoryCounts(documents: Array<Document>): void;
    rankedSearch(query: Query, dictionary: TermDictionary, documents: Array<Document>, parameter: SearchParameter): QueryResult;
}
