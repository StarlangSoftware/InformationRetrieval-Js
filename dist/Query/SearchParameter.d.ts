import { RetrievalType } from "./RetrievalType";
import { DocumentWeighting } from "../Document/DocumentWeighting";
import { TermWeighting } from "../Index/TermWeighting";
export declare class SearchParameter {
    private retrievalType;
    private documentWeighting;
    private termWeighting;
    private documentsRetrieved;
    constructor();
    setRetrievalType(retrievalType: RetrievalType): void;
    setDocumentWeighting(documentWeighting: DocumentWeighting): void;
    setTermWeighting(termWeighting: TermWeighting): void;
    setDocumentsRetrieved(documentsRetrieved: number): void;
    getRetrievalType(): RetrievalType;
    getDocumentWeighting(): DocumentWeighting;
    getTermWeighting(): TermWeighting;
    getDocumentsRetrieved(): number;
}
