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
    private searchAttributes;
    /**
     * Empty constructor for SearchParameter object.
     */
    constructor();
    /**
     * Setter for the retrievalType.
     * @param retrievalType New retrieval type
     */
    setRetrievalType(retrievalType: RetrievalType): void;
    /**
     * Mutator for the documentWeighting scheme used in tf-idf search.
     * @param documentWeighting New document weighting scheme for tf-idf search.
     */
    setDocumentWeighting(documentWeighting: DocumentWeighting): void;
    /**
     * Mutator for the termWeighting scheme used in tf-idf search.
     * @param termWeighting New term weighting scheme for tf-idf search.
     */
    setTermWeighting(termWeighting: TermWeighting): void;
    /**
     * Mutator for the maximum number of documents retrieved.
     * @param documentsRetrieved New value for the maximum number of documents retrieved.
     */
    setDocumentsRetrieved(documentsRetrieved: number): void;
    /**
     * Mutator for the category determination type.
     * @param categoryDeterminationType New category determination type.
     */
    setCategoryDeterminationType(categoryDeterminationType: CategoryDeterminationType): void;
    /**
     * Mutator for the focus type.
     * @param focusType New focus type.
     */
    setFocusType(focusType: FocusType): void;
    /**
     * Mutator for the search attributes field. The parameter will determine if an attribute search is performed.
     * @param searchAttributes New value for search attribute.
     */
    setSearchAttributes(searchAttributes: boolean): void;
    /**
     * Accessor for the retrieval type
     * @return Retrieval type.
     */
    getRetrievalType(): RetrievalType;
    /**
     * Accessor for the document weighting scheme in tf-idf search
     * @return Document weighting scheme in tf-idf search
     */
    getDocumentWeighting(): DocumentWeighting;
    /**
     * Accessor for the term weighting scheme in tf-idf search
     * @return Term weighting scheme in tf-idf search
     */
    getTermWeighting(): TermWeighting;
    /**
     * Accessor for the maximum number of documents retrieved.
     * @return The maximum number of documents retrieved.
     */
    getDocumentsRetrieved(): number;
    /**
     * Accessor for the focus type.
     * @return Focus type.
     */
    getFocusType(): FocusType;
    /**
     * Accessor for the category determination type.
     * @return Category determination type.
     */
    getCategoryDeterminationType(): CategoryDeterminationType;
    /**
     * Accessor for the search attributes field. The parameter will determine if an attribute search is performed.
     * @return Search attribute.
     */
    getSearchAttributes(): boolean;
}
