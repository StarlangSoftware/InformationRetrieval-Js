import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import { Parameter } from "./Parameter";
import { TermType } from "../Index/TermType";
import { TermOccurrence } from "../Index/TermOccurrence";
import { Query } from "../Query/Query";
import { QueryResult } from "../Query/QueryResult";
import { SearchParameter } from "../Query/SearchParameter";
import { CategoryNode } from "../Index/CategoryNode";
import { AbstractCollection } from "./AbstractCollection";
export declare class MemoryCollection extends AbstractCollection {
    private readonly indexType;
    constructor(directory: string, parameter: Parameter);
    loadIndexesFromFile(directory: string): void;
    save(): void;
    saveCategories(): void;
    constructIndexesInMemory(): void;
    termComparator: (comparator: WordComparator) => (termA: TermOccurrence, termB: TermOccurrence) => number;
    constructTerms(termType: TermType): Array<TermOccurrence>;
    attributeSearch(query: Query, parameter: SearchParameter): QueryResult;
    searchWithInvertedIndex(query: Query, searchParameter: SearchParameter): QueryResult;
    filterAccordingToCategories(currentResult: QueryResult, categories: Array<CategoryNode>): QueryResult;
    autoCompleteWord(prefix: string): Array<string>;
    searchCollection(query: Query, searchParameter: SearchParameter): QueryResult;
}
