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
    /**
     * Constructor for the Document class. Sets the attributes.
     * @param documentType Type of the document. Can be normal for normal documents, categorical for categorical
     *                     documents.
     * @param absoluteFileName Absolute file name of the document
     * @param fileName Relative file name of the document.
     * @param docId Id of the document
     */
    constructor(documentType: DocumentType, absoluteFileName: string, fileName: string, docId: number);
    /**
     * Loads the document from input stream. For normal documents, it reads as a corpus. For categorical documents, the
     * first line contains categorical information, second line contains name of the product, third line contains
     * detailed info about the product.
     * @return Loaded document text.
     */
    loadDocument(): DocumentText;
    /**
     * Loads the category of the document and adds it to the category tree. Category information is stored in the first
     * line of the document.
     * @param categoryTree Category tree to which new product will be added.
     */
    loadCategory(categoryTree: CategoryTree): void;
    normalizeDocument(disambiguator: MorphologicalDisambiguator, fsm: FsmMorphologicalAnalyzer): Corpus;
    /**
     * Accessor for the docId attribute.
     * @return docId attribute.
     */
    getDocId(): number;
    /**
     * Accessor for the fileName attribute.
     * @return fileName attribute.
     */
    getFileName(): string;
    /**
     * Accessor for the absoluteFileName attribute.
     * @return absoluteFileName attribute.
     */
    getAbsoluteFileName(): string;
    /**
     * Accessor for the size attribute.
     * @return size attribute.
     */
    getSize(): number;
    /**
     * Mutator for the size attribute.
     * @param size New size attribute.
     */
    setSize(size: number): void;
    /**
     * Mutator for the category attribute.
     * @param categoryTree Category tree to which new category will be added.
     * @param category New category that will be added
     */
    setCategory(categoryTree: CategoryTree, category: string): void;
    /**
     * Accessor for the category attribute.
     * @return Category attribute as a String
     */
    getCategory(): string;
    /**
     * Accessor for the category attribute.
     * @return Category attribute as a CategoryNode.
     */
    getCategoryNode(): CategoryNode;
}
