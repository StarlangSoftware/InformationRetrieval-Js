import {InvertedIndex} from "./InvertedIndex";
import {TermOccurrence} from "./TermOccurrence";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";

export class NGramIndex extends InvertedIndex{

    /**
     * Constructs an NGram index from a list of sorted tokens. The terms array should be sorted before calling this
     * method. Calls the constructor for the InvertedIndex.
     * @param dictionaryOrFileName Term dictionary
     * @param terms Sorted list of tokens in the memory collection.
     * @param comparator Comparator method to compare two terms.
     */
    constructor(dictionaryOrFileName?: any,
                terms?: Array<TermOccurrence>,
                comparator?: WordComparator){
        super(dictionaryOrFileName, terms, comparator)
    }
}