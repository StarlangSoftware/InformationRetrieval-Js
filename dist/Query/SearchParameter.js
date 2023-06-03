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
        constructor() {
            this.retrievalType = RetrievalType_1.RetrievalType.RANKED;
            this.documentWeighting = DocumentWeighting_1.DocumentWeighting.NO_IDF;
            this.termWeighting = TermWeighting_1.TermWeighting.NATURAL;
            this.documentsRetrieved = 1;
            this.categoryDeterminationType = CategoryDeterminationType_1.CategoryDeterminationType.KEYWORD;
            this.focusType = FocusType_1.FocusType.OVERALL;
            this.searchAttributes = false;
        }
        setRetrievalType(retrievalType) {
            this.retrievalType = retrievalType;
        }
        setDocumentWeighting(documentWeighting) {
            this.documentWeighting = documentWeighting;
        }
        setTermWeighting(termWeighting) {
            this.termWeighting = termWeighting;
        }
        setDocumentsRetrieved(documentsRetrieved) {
            this.documentsRetrieved = documentsRetrieved;
        }
        setCategoryDeterminationType(categoryDeterminationType) {
            this.categoryDeterminationType = categoryDeterminationType;
        }
        setFocusType(focusType) {
            this.focusType = focusType;
        }
        setSearchAttributes(searchAttributes) {
            this.searchAttributes = searchAttributes;
        }
        getRetrievalType() {
            return this.retrievalType;
        }
        getDocumentWeighting() {
            return this.documentWeighting;
        }
        getTermWeighting() {
            return this.termWeighting;
        }
        getDocumentsRetrieved() {
            return this.documentsRetrieved;
        }
        getFocusType() {
            return this.focusType;
        }
        getCategoryDeterminationType() {
            return this.categoryDeterminationType;
        }
        getSearchAttributes() {
            return this.searchAttributes;
        }
    }
    exports.SearchParameter = SearchParameter;
});
//# sourceMappingURL=SearchParameter.js.map