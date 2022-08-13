import { DocumentText } from "./DocumentText";
import { MorphologicalDisambiguator } from "nlptoolkit-morphologicaldisambiguation/dist/MorphologicalDisambiguator";
import { FsmMorphologicalAnalyzer } from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/FsmMorphologicalAnalyzer";
import { Corpus } from "nlptoolkit-corpus/dist/Corpus";
export declare class Document {
    private readonly absoluteFileName;
    private readonly fileName;
    private readonly docId;
    private size;
    constructor(absoluteFileName: string, fileName: string, docId: number);
    loadDocument(): DocumentText;
    normalizeDocument(disambiguator: MorphologicalDisambiguator, fsm: FsmMorphologicalAnalyzer): Corpus;
    getDocId(): number;
    getFileName(): string;
    getAbsoluteFileName(): string;
    getSize(): number;
}
