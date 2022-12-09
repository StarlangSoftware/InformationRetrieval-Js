import { DiskCollection } from "./DiskCollection";
import { Parameter } from "./Parameter";
import { TermType } from "../Index/TermType";
import { TermDictionary } from "../Index/TermDictionary";
import { NGramIndex } from "../Index/NGramIndex";
export declare class LargeCollection extends DiskCollection {
    constructor(directory: string, parameter: Parameter);
    constructDictionaryAndIndexesInDisk(): void;
    notCombinedAllDictionaries(currentWords: Array<string>): boolean;
    selectDictionariesWithMinimumWords(currentWords: Array<string>): Array<number>;
    combineMultipleDictionariesInDisk(name: string, tmpName: string, blockCount: number): void;
    constructDictionaryAndInvertedIndexInDisk(termType: TermType): void;
    constructDictionaryAndPositionalIndexInDisk(termType: TermType): void;
    hashCode(s: string): number;
    addNGramsToDictionaryAndIndex(line: string, k: number, nGramDictionary: TermDictionary, nGramIndex: NGramIndex): void;
    constructNGramDictionaryAndIndexInDisk(): void;
}
