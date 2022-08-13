import {InvertedIndex} from "./InvertedIndex";
import {TermOccurrence} from "./TermOccurrence";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";

export class NGramIndex extends InvertedIndex{

    constructor(dictionaryOrFileName?: any,
                terms?: Array<TermOccurrence>,
                comparator?: WordComparator){
        super(dictionaryOrFileName, terms, comparator)
    }
}