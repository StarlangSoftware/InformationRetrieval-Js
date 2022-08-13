import { Corpus } from "nlptoolkit-corpus/dist/Corpus";
import { SentenceSplitter } from "nlptoolkit-corpus/dist/SentenceSplitter";
import { TermType } from "../Index/TermType";
import { TermOccurrence } from "../Index/TermOccurrence";
export declare class DocumentText extends Corpus {
    constructor(fileName: string, sentenceSplitter?: SentenceSplitter);
    constructDistinctWordList(termType: TermType): Set<string>;
    constructTermList(docId: number, termType: TermType): Array<TermOccurrence>;
}
