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
    private searchAttributes: boolean

    /**
     * Empty constructor for SearchParameter object.
     */
    constructor() {
        this.retrievalType = RetrievalType.RANKED
        this.documentWeighting = DocumentWeighting.NO_IDF
        this.termWeighting = TermWeighting.NATURAL
        this.documentsRetrieved = 1
        this.categoryDeterminationType = CategoryDeterminationType.KEYWORD
        this.focusType = FocusType.OVERALL
        this.searchAttributes = false
    }

    /**
     * Setter for the retrievalType.
     * @param retrievalType New retrieval type
     */
    setRetrievalType(retrievalType: RetrievalType) {
        this.retrievalType = retrievalType
    }

    /**
     * Mutator for the documentWeighting scheme used in tf-idf search.
     * @param documentWeighting New document weighting scheme for tf-idf search.
     */
    setDocumentWeighting(documentWeighting: DocumentWeighting) {
        this.documentWeighting = documentWeighting
    }

    /**
     * Mutator for the termWeighting scheme used in tf-idf search.
     * @param termWeighting New term weighting scheme for tf-idf search.
     */
    setTermWeighting(termWeighting: TermWeighting) {
        this.termWeighting = termWeighting
    }

    /**
     * Mutator for the maximum number of documents retrieved.
     * @param documentsRetrieved New value for the maximum number of documents retrieved.
     */
    setDocumentsRetrieved(documentsRetrieved: number) {
        this.documentsRetrieved = documentsRetrieved
    }

    /**
     * Mutator for the category determination type.
     * @param categoryDeterminationType New category determination type.
     */
    setCategoryDeterminationType(categoryDeterminationType: CategoryDeterminationType) {
        this.categoryDeterminationType = categoryDeterminationType
    }

    /**
     * Mutator for the focus type.
     * @param focusType New focus type.
     */
    setFocusType(focusType: FocusType) {
        this.focusType = focusType
    }

    /**
     * Mutator for the search attributes field. The parameter will determine if an attribute search is performed.
     * @param searchAttributes New value for search attribute.
     */
    setSearchAttributes(searchAttributes: boolean) {
        this.searchAttributes = searchAttributes;
    }

    /**
     * Accessor for the retrieval type
     * @return Retrieval type.
     */
    getRetrievalType(): RetrievalType {
        return this.retrievalType
    }

    /**
     * Accessor for the document weighting scheme in tf-idf search
     * @return Document weighting scheme in tf-idf search
     */
    getDocumentWeighting(): DocumentWeighting {
        return this.documentWeighting
    }

    /**
     * Accessor for the term weighting scheme in tf-idf search
     * @return Term weighting scheme in tf-idf search
     */
    getTermWeighting(): TermWeighting {
        return this.termWeighting
    }

    /**
     * Accessor for the maximum number of documents retrieved.
     * @return The maximum number of documents retrieved.
     */
    getDocumentsRetrieved(): number {
        return this.documentsRetrieved
    }

    /**
     * Accessor for the focus type.
     * @return Focus type.
     */
    getFocusType(): FocusType {
        return this.focusType
    }

    /**
     * Accessor for the category determination type.
     * @return Category determination type.
     */
    getCategoryDeterminationType(): CategoryDeterminationType {
        return this.categoryDeterminationType
    }

    /**
     * Accessor for the search attributes field. The parameter will determine if an attribute search is performed.
     * @return Search attribute.
     */
    getSearchAttributes(): boolean {
        return this.searchAttributes;
    }

}