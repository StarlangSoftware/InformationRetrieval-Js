import { DiskCollection } from "./DiskCollection";
import { Parameter } from "./Parameter";
import { TermType } from "../Index/TermType";
import { TermDictionary } from "../Index/TermDictionary";
export declare class MediumCollection extends DiskCollection {
    constructor(directory: string, parameter: Parameter);
    constructIndexesInDisk(): void;
    constructDistinctWordList(termType: TermType): Set<string>;
    constructInvertedIndexInDisk(dictionary: TermDictionary, termType: TermType): void;
    constructPositionalIndexInDisk(dictionary: TermDictionary, termType: TermType): void;
}
