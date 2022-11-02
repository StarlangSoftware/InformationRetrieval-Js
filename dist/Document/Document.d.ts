import { DocumentText } from "./DocumentText";
import { MorphologicalDisambiguator } from "nlptoolkit-morphologicaldisambiguation/dist/MorphologicalDisambiguator";
import { FsmMorphologicalAnalyzer } from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/FsmMorphologicalAnalyzer";
import { Corpus } from "nlptoolkit-corpus/dist/Corpus";
import { DocumentType } from "./DocumentType";
import { CategoryNode } from "../Index/CategoryNode";
import { CategoryTree } from "../Index/CategoryTree";
export declare class Document {
    private readonly absoluteFileName;
    private readonly fileName;
    private readonly docId;
    private size;
    private readonly documentType;
    private category;
    constructor(documentType: DocumentType, absoluteFileName: string, fileName: string, docId: number);
    loadDocument(): DocumentText;
    loadCategory(categoryTree: CategoryTree): void;
    normalizeDocument(disambiguator: MorphologicalDisambiguator, fsm: FsmMorphologicalAnalyzer): Corpus;
    getDocId(): number;
    getFileName(): string;
    getAbsoluteFileName(): string;
    getSize(): number;
    setSize(size: number): void;
    setCategory(categoryTree: CategoryTree, category: string): void;
    getCategory(): string;
    getCategoryNode(): CategoryNode;
}
