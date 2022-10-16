import {RetrievalType} from "./RetrievalType";
import {DocumentWeighting} from "../Document/DocumentWeighting";
import {TermWeighting} from "../Index/TermWeighting";

export class SearchParameter {

    private retrievalType : RetrievalType
    private documentWeighting : DocumentWeighting
    private termWeighting : TermWeighting
    private documentsRetrieved : number

    constructor(){
        this.retrievalType = RetrievalType.RANKED
        this.documentWeighting = DocumentWeighting.NO_IDF
        this.termWeighting = TermWeighting.NATURAL
        this.documentsRetrieved = 1
    }

    setRetrievalType(retrievalType: RetrievalType) {
        this.retrievalType = retrievalType
    }

    setDocumentWeighting(documentWeighting: DocumentWeighting) {
        this.documentWeighting = documentWeighting
    }

    setTermWeighting(termWeighting: TermWeighting) {
        this.termWeighting = termWeighting
    }

    setDocumentsRetrieved(documentsRetrieved: number) {
        this.documentsRetrieved = documentsRetrieved
    }

    getRetrievalType() : RetrievalType{
        return this.retrievalType
    }

    getDocumentWeighting() : DocumentWeighting{
        return this.documentWeighting
    }

    getTermWeighting() : TermWeighting{
        return this.termWeighting
    }

    getDocumentsRetrieved() : number{
        return this.documentsRetrieved
    }

}