import {AbstractCollection} from "./AbstractCollection";
import {Parameter} from "./Parameter";
import {PostingList} from "../Index/PostingList";
import * as fs from "fs";
import {PositionalPostingList} from "../Index/PositionalPostingList";

export class DiskCollection extends AbstractCollection{

    constructor(directory: string, parameter: Parameter) {
        super(directory, parameter)
    }

    /**
     * In single pass in memory indexing, the index files are merged to get the final index file. This method
     * checks if all parallel index files are combined or not.
     * @param currentIdList Current pointers for the terms in parallel index files. currentIdList[0] is the current term
     *                     in the first index file to be combined, currentIdList[2] is the current term in the second
     *                     index file to be combined etc.
     * @return True, if all merge operation is completed, false otherwise.
     */
    notCombinedAllIndexes(currentIdList: Array<number>): boolean{
        for (let id of currentIdList){
            if (id != -1){
                return true
            }
        }
        return false
    }

    /**
     * In single pass in memory indexing, the index files are merged to get the final index file. This method
     * identifies the indexes whose terms to be merged have the smallest term id. They will be selected and
     * combined in the next phase.
     * @param currentIdList Current pointers for the terms in parallel index files. currentIdList[0] is the current term
     *                     in the first index file to be combined, currentIdList[2] is the current term in the second
     *                     index file to be combined etc.
     * @return An array list of indexes for the index files, whose terms to be merged have the smallest term id.
     */
    selectIndexesWithMinimumTermIds(currentIdList: Array<number>): Array<number>{
        let result = new Array<number>()
        let min = Number.MAX_VALUE
        for (let id of currentIdList){
            if (id != -1 && id < min){
                min = id
            }
        }
        for (let i = 0; i < currentIdList.length; i++){
            if (currentIdList[i] == min){
                result.push(i)
            }
        }
        return result
    }

    /**
     * In single pass in memory indexing, the index files are merged to get the final index file. This method
     * implements the merging algorithm. Reads the index files in parallel and at each iteration merges the posting
     * lists of the smallest term and put it to the merged index file. Updates the pointers of the indexes accordingly.
     * @param name Name of the collection.
     * @param tmpName Temporary name of the index files.
     * @param blockCount Number of index files to be merged.
     */
    combineMultipleInvertedIndexesInDisk(name: string, tmpName: string, blockCount: number){
        let currentIdList = new Array<number>()
        let currentPostingLists = new Array<PostingList>()
        let files = new Array<number>()
        let filesData = new Array<Array<string>>()
        let output = ""
        for (let i = 0; i < blockCount; i++){
            files.push(0)
            filesData.push(fs.readFileSync("tmp-" + tmpName + i + "-postings.txt", "utf-8").split('\n'))
            let line = this.getLine(filesData, files, i)
            let items = line.split(" ")
            currentIdList.push(parseInt(items[0]))
            line = this.getLine(filesData, files, i)
            currentPostingLists.push(new PostingList(line))
        }
        while (this.notCombinedAllIndexes(currentIdList)){
            let indexesToCombine = this.selectIndexesWithMinimumTermIds(currentIdList)
            let mergedPostingList = currentPostingLists[indexesToCombine[0]]
            for (let i = 1; i < indexesToCombine.length; i++){
                mergedPostingList = mergedPostingList.union(currentPostingLists[indexesToCombine[i]])
            }
            output = output + mergedPostingList.writeToFile(currentIdList[indexesToCombine[0]])
            for (let i of indexesToCombine) {
                let line = this.getLine(filesData, files, i)
                if (files[i] < filesData[i].length) {
                    let items = line.split(" ")
                    currentIdList[i] = parseInt(items[0])
                    line = this.getLine(filesData, files, i)
                    currentPostingLists[i] = new PostingList(line)
                } else {
                    currentIdList[i] = -1
                }
            }
        }
        fs.writeFileSync(name + "-postings.txt", output,"utf-8")
    }

    /**
     * In single pass in memory indexing, the index files are merged to get the final index file. This method
     * implements the merging algorithm. Reads the index files in parallel and at each iteration merges the positional
     * posting lists of the smallest term and put it to the merged index file. Updates the pointers of the indexes accordingly.
     * @param name Name of the collection.
     * @param blockCount Number of index files to be merged.
     */
    combineMultiplePositionalIndexesInDisk(name: string, blockCount: number){
        let currentIdList = new Array<number>()
        let currentPostingLists = new Array<PositionalPostingList>()
        let files = new Array<number>()
        let filesData = new Array<Array<string>>()
        let output = ""
        for (let i = 0; i < blockCount; i++){
            files.push(0)
            filesData.push(fs.readFileSync("tmp-" + i + "-positionalPostings.txt", "utf-8").split('\n'))
            let line = this.getLine(filesData, files, i)
            let items = line.split(" ")
            currentIdList.push(parseInt(items[0]))
            let lineCount = parseInt(items[1])
            currentPostingLists.push(new PositionalPostingList(this.getLines(filesData, files, i, lineCount)))
        }
        while (this.notCombinedAllIndexes(currentIdList)){
            let indexesToCombine = this.selectIndexesWithMinimumTermIds(currentIdList)
            let mergedPostingList = currentPostingLists[indexesToCombine[0]]
            for (let i = 1; i < indexesToCombine.length; i++){
                mergedPostingList = mergedPostingList.union(currentPostingLists[indexesToCombine[i]])
            }
            output = output + mergedPostingList.writeToFile(currentIdList[indexesToCombine[0]])
            for (let i of indexesToCombine) {
                let line = this.getLine(filesData, files, i)
                if (files[i] < filesData[i].length) {
                    let items = line.split(" ")
                    currentIdList[i] = parseInt(items[0])
                    let lineCount = parseInt(items[1])
                    currentPostingLists[i] = new PositionalPostingList(this.getLines(filesData, files, i, lineCount))
                } else {
                    currentIdList[i] = -1
                }
            }
        }
        fs.writeFileSync(name + "-positionalPostings.txt", output,"utf-8")
    }

}