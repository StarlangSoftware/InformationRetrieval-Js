import { AbstractCollection } from "./AbstractCollection";
import { Parameter } from "./Parameter";
export declare class DiskCollection extends AbstractCollection {
    constructor(directory: string, parameter: Parameter);
    /**
     * In single pass in memory indexing, the index files are merged to get the final index file. This method
     * checks if all parallel index files are combined or not.
     * @param currentIdList Current pointers for the terms in parallel index files. currentIdList[0] is the current term
     *                     in the first index file to be combined, currentIdList[2] is the current term in the second
     *                     index file to be combined etc.
     * @return True, if all merge operation is completed, false otherwise.
     */
    notCombinedAllIndexes(currentIdList: Array<number>): boolean;
    /**
     * In single pass in memory indexing, the index files are merged to get the final index file. This method
     * identifies the indexes whose terms to be merged have the smallest term id. They will be selected and
     * combined in the next phase.
     * @param currentIdList Current pointers for the terms in parallel index files. currentIdList[0] is the current term
     *                     in the first index file to be combined, currentIdList[2] is the current term in the second
     *                     index file to be combined etc.
     * @return An array list of indexes for the index files, whose terms to be merged have the smallest term id.
     */
    selectIndexesWithMinimumTermIds(currentIdList: Array<number>): Array<number>;
    /**
     * In single pass in memory indexing, the index files are merged to get the final index file. This method
     * implements the merging algorithm. Reads the index files in parallel and at each iteration merges the posting
     * lists of the smallest term and put it to the merged index file. Updates the pointers of the indexes accordingly.
     * @param name Name of the collection.
     * @param tmpName Temporary name of the index files.
     * @param blockCount Number of index files to be merged.
     */
    combineMultipleInvertedIndexesInDisk(name: string, tmpName: string, blockCount: number): void;
    /**
     * In single pass in memory indexing, the index files are merged to get the final index file. This method
     * implements the merging algorithm. Reads the index files in parallel and at each iteration merges the positional
     * posting lists of the smallest term and put it to the merged index file. Updates the pointers of the indexes accordingly.
     * @param name Name of the collection.
     * @param blockCount Number of index files to be merged.
     */
    combineMultiplePositionalIndexesInDisk(name: string, blockCount: number): void;
}
