import { PostingList } from "./PostingList";
import { TermDictionary } from "./TermDictionary";
import { TermOccurrence } from "./TermOccurrence";
import { WordComparator } from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import { Query } from "../Query/Query";
import { QueryResult } from "../Query/QueryResult";
export declare class InvertedIndex {
    private index;
    constructor(dictionaryOrFileName?: any, terms?: Array<TermOccurrence>, comparator?: WordComparator);
    readPostingList(fileName: string): void;
    keyComparator: (a: (string | number)[], b: (string | number)[]) => 1 | -1 | 0;
    saveSorted(fileName: string): void;
    save(fileName: string): void;
    add(termId: number, docId: number): void;
    postingListComparator: (listA: PostingList, listB: PostingList) => 1 | -1 | 0;
    autoCompleteWord(wordList: Array<string>, dictionary: TermDictionary): void;
    search(query: Query, dictionary: TermDictionary): QueryResult;
}
