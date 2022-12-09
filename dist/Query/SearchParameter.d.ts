import { RetrievalType } from "./RetrievalType";
import { DocumentWeighting } from "../Document/DocumentWeighting";
import { TermWeighting } from "../Index/TermWeighting";
import { CategoryDeterminationType } from "./CategoryDeterminationType";
import { FocusType } from "./FocusType";
export declare class SearchParameter {
    private retrievalType;
    private documentWeighting;
    private termWeighting;
    private documentsRetrieved;
    private categoryDeterminationType;
    private focusType;
    constructor();
    setRetrievalType(retrievalType: RetrievalType): void;
    setDocumentWeighting(documentWeighting: DocumentWeighting): void;
    setTermWeighting(termWeighting: TermWeighting): void;
    setDocumentsRetrieved(documentsRetrieved: number): void;
    setCategoryDeterminationType(categoryDeterminationType: CategoryDeterminationType): void;
    setFocusType(focusType: FocusType): void;
    getRetrievalType(): RetrievalType;
    getDocumentWeighting(): DocumentWeighting;
    getTermWeighting(): TermWeighting;
    getDocumentsRetrieved(): number;
    getFocusType(): FocusType;
    getCategoryDeterminationType(): CategoryDeterminationType;
}
