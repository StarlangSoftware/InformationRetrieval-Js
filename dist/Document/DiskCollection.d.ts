import { AbstractCollection } from "./AbstractCollection";
import { Parameter } from "./Parameter";
export declare class DiskCollection extends AbstractCollection {
    constructor(directory: string, parameter: Parameter);
    notCombinedAllIndexes(currentIdList: Array<number>): boolean;
    selectIndexesWithMinimumTermIds(currentIdList: Array<number>): Array<number>;
    combineMultipleInvertedIndexesInDisk(name: string, tmpName: string, blockCount: number): void;
    combineMultiplePositionalIndexesInDisk(name: string, blockCount: number): void;
}
