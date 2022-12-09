import {RetrievalType} from "./RetrievalType";
import {DocumentWeighting} from "../Document/DocumentWeighting";
import {TermWeighting} from "../Index/TermWeighting";
import {CategoryDeterminationType} from "./CategoryDeterminationType";
import {FocusType} from "./FocusType";

export class SearchParameter {

    private retrievalType: RetrievalType
    private documentWeighting: DocumentWeighting
    private termWeighting: TermWeighting
    private documentsRetrieved: number
    private categoryDeterminationType: CategoryDeterminationType
    private focusType: FocusType

    constructor() {
        this.retrievalType = RetrievalType.RANKED
        this.documentWeighting = DocumentWeighting.NO_IDF
        this.termWeighting = TermWeighting.NATURAL
        this.documentsRetrieved = 1
        this.categoryDeterminationType = CategoryDeterminationType.KEYWORD
        this.focusType = FocusType.OVERALL
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

    setCategoryDeterminationType(categoryDeterminationType: CategoryDeterminationType) {
        this.categoryDeterminationType = categoryDeterminationType
    }

    setFocusType(focusType: FocusType) {
        this.focusType = focusType
    }

    getRetrievalType(): RetrievalType {
        return this.retrievalType
    }

    getDocumentWeighting(): DocumentWeighting {
        return this.documentWeighting
    }

    getTermWeighting(): TermWeighting {
        return this.termWeighting
    }

    getDocumentsRetrieved(): number {
        return this.documentsRetrieved
    }

    getFocusType(): FocusType {
        return this.focusType
    }

    getCategoryDeterminationType(): CategoryDeterminationType {
        return this.categoryDeterminationType
    }

}