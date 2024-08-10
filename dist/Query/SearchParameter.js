(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./RetrievalType", "../Document/DocumentWeighting", "../Index/TermWeighting", "./CategoryDeterminationType", "./FocusType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchParameter = void 0;
    const RetrievalType_1 = require("./RetrievalType");
    const DocumentWeighting_1 = require("../Document/DocumentWeighting");
    const TermWeighting_1 = require("../Index/TermWeighting");
    const CategoryDeterminationType_1 = require("./CategoryDeterminationType");
    const FocusType_1 = require("./FocusType");
    class SearchParameter {
        /**
         * Empty constructor for SearchParameter object.
         */
        constructor() {
            this.retrievalType = RetrievalType_1.RetrievalType.RANKED;
            this.documentWeighting = DocumentWeighting_1.DocumentWeighting.NO_IDF;
            this.termWeighting = TermWeighting_1.TermWeighting.NATURAL;
            this.documentsRetrieved = 1;
            this.categoryDeterminationType = CategoryDeterminationType_1.CategoryDeterminationType.KEYWORD;
            this.focusType = FocusType_1.FocusType.OVERALL;
            this.searchAttributes = false;
        }
        /**
         * Setter for the retrievalType.
         * @param retrievalType New retrieval type
         */
        setRetrievalType(retrievalType) {
            this.retrievalType = retrievalType;
        }
        /**
         * Mutator for the documentWeighting scheme used in tf-idf search.
         * @param documentWeighting New document weighting scheme for tf-idf search.
         */
        setDocumentWeighting(documentWeighting) {
            this.documentWeighting = documentWeighting;
        }
        /**
         * Mutator for the termWeighting scheme used in tf-idf search.
         * @param termWeighting New term weighting scheme for tf-idf search.
         */
        setTermWeighting(termWeighting) {
            this.termWeighting = termWeighting;
        }
        /**
         * Mutator for the maximum number of documents retrieved.
         * @param documentsRetrieved New value for the maximum number of documents retrieved.
         */
        setDocumentsRetrieved(documentsRetrieved) {
            this.documentsRetrieved = documentsRetrieved;
        }
        /**
         * Mutator for the category determination type.
         * @param categoryDeterminationType New category determination type.
         */
        setCategoryDeterminationType(categoryDeterminationType) {
            this.categoryDeterminationType = categoryDeterminationType;
        }
        /**
         * Mutator for the focus type.
         * @param focusType New focus type.
         */
        setFocusType(focusType) {
            this.focusType = focusType;
        }
        /**
         * Mutator for the search attributes field. The parameter will determine if an attribute search is performed.
         * @param searchAttributes New value for search attribute.
         */
        setSearchAttributes(searchAttributes) {
            this.searchAttributes = searchAttributes;
        }
        /**
         * Accessor for the retrieval type
         * @return Retrieval type.
         */
        getRetrievalType() {
            return this.retrievalType;
        }
        /**
         * Accessor for the document weighting scheme in tf-idf search
         * @return Document weighting scheme in tf-idf search
         */
        getDocumentWeighting() {
            return this.documentWeighting;
        }
        /**
         * Accessor for the term weighting scheme in tf-idf search
         * @return Term weighting scheme in tf-idf search
         */
        getTermWeighting() {
            return this.termWeighting;
        }
        /**
         * Accessor for the maximum number of documents retrieved.
         * @return The maximum number of documents retrieved.
         */
        getDocumentsRetrieved() {
            return this.documentsRetrieved;
        }
        /**
         * Accessor for the focus type.
         * @return Focus type.
         */
        getFocusType() {
            return this.focusType;
        }
        /**
         * Accessor for the category determination type.
         * @return Category determination type.
         */
        getCategoryDeterminationType() {
            return this.categoryDeterminationType;
        }
        /**
         * Accessor for the search attributes field. The parameter will determine if an attribute search is performed.
         * @return Search attribute.
         */
        getSearchAttributes() {
            return this.searchAttributes;
        }
    }
    exports.SearchParameter = SearchParameter;
});
//# sourceMappingURL=SearchParameter.js.map