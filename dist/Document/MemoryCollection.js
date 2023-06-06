(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./IndexType", "../Index/TermDictionary", "../Index/IncidenceMatrix", "../Index/NGramIndex", "../Index/InvertedIndex", "../Index/PositionalIndex", "../Index/TermType", "fs", "../Index/TermOccurrence", "../Query/Query", "../Query/RetrievalType", "../Query/QueryResult", "./DocumentType", "../Index/CategoryTree", "../Query/FocusType", "./AbstractCollection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MemoryCollection = void 0;
    const IndexType_1 = require("./IndexType");
    const TermDictionary_1 = require("../Index/TermDictionary");
    const IncidenceMatrix_1 = require("../Index/IncidenceMatrix");
    const NGramIndex_1 = require("../Index/NGramIndex");
    const InvertedIndex_1 = require("../Index/InvertedIndex");
    const PositionalIndex_1 = require("../Index/PositionalIndex");
    const TermType_1 = require("../Index/TermType");
    const fs = require("fs");
    const TermOccurrence_1 = require("../Index/TermOccurrence");
    const Query_1 = require("../Query/Query");
    const RetrievalType_1 = require("../Query/RetrievalType");
    const QueryResult_1 = require("../Query/QueryResult");
    const DocumentType_1 = require("./DocumentType");
    const CategoryTree_1 = require("../Index/CategoryTree");
    const FocusType_1 = require("../Query/FocusType");
    const AbstractCollection_1 = require("./AbstractCollection");
    class MemoryCollection extends AbstractCollection_1.AbstractCollection {
        constructor(directory, parameter) {
            super(directory, parameter);
            this.termComparator = (comparator) => (termA, termB) => (TermOccurrence_1.TermOccurrence.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) != 0 ?
                TermOccurrence_1.TermOccurrence.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) :
                (termA.getDocId() == termB.getDocId() ?
                    (termA.getPosition() == termB.getPosition() ?
                        0 : (termA.getPosition() < termB.getPosition() ?
                        -1 : 1)) :
                    (termA.getDocId() < termB.getDocId() ?
                        -1 : 1)));
            this.indexType = parameter.getIndexType();
            if (parameter.loadIndexesFromFile()) {
                this.loadIndexesFromFile(directory);
            }
            else {
                this.constructIndexesInMemory();
            }
            if (parameter.getDocumentType() == DocumentType_1.DocumentType.CATEGORICAL) {
                this.positionalIndex.setCategoryCounts(this.documents);
                this.categoryTree.setRepresentativeCount(parameter.getRepresentativeCount());
            }
        }
        loadIndexesFromFile(directory) {
            this.dictionary = new TermDictionary_1.TermDictionary(this.comparator, directory);
            this.invertedIndex = new InvertedIndex_1.InvertedIndex(directory);
            if (this.parameter.constructPositionalIndex()) {
                this.positionalIndex = new PositionalIndex_1.PositionalIndex(directory);
                this.positionalIndex.setDocumentSizes(this.documents);
            }
            if (this.parameter.constructPhraseIndex()) {
                this.phraseDictionary = new TermDictionary_1.TermDictionary(this.comparator, directory + "-phrase");
                this.phraseIndex = new InvertedIndex_1.InvertedIndex(directory + "-phrase");
                if (this.parameter.constructPositionalIndex()) {
                    this.phrasePositionalIndex = new PositionalIndex_1.PositionalIndex(directory + "-phrase");
                }
            }
            if (this.parameter.constructNGramIndex()) {
                this.biGramDictionary = new TermDictionary_1.TermDictionary(this.comparator, directory + "-biGram");
                this.triGramDictionary = new TermDictionary_1.TermDictionary(this.comparator, directory + "-triGram");
                this.biGramIndex = new NGramIndex_1.NGramIndex(directory + "-biGram");
                this.triGramIndex = new NGramIndex_1.NGramIndex(directory + "-triGram");
            }
        }
        save() {
            if (this.indexType == IndexType_1.IndexType.INVERTED_INDEX) {
                this.dictionary.save(this.name);
                this.invertedIndex.save(this.name);
                if (this.parameter.constructPositionalIndex()) {
                    this.positionalIndex.save(this.name);
                }
                if (this.parameter.constructPhraseIndex()) {
                    this.phraseDictionary.save(this.name + "-phrase");
                    this.phraseIndex.save(this.name + "-phrase");
                    if (this.parameter.constructPositionalIndex()) {
                        this.phrasePositionalIndex.save(this.name + "-phrase");
                    }
                }
                if (this.parameter.constructNGramIndex()) {
                    this.biGramDictionary.save(this.name + "-biGram");
                    this.triGramDictionary.save(this.name + "-triGram");
                    this.biGramIndex.save(this.name + "-biGram");
                    this.triGramIndex.save(this.name + "-triGram");
                }
            }
            if (this.parameter.getDocumentType() == DocumentType_1.DocumentType.CATEGORICAL) {
                this.saveCategories();
            }
        }
        saveCategories() {
            let output = "";
            for (let document of this.documents) {
                output = output + document.getDocId() + "\t" + document.getCategory().toString() + "\n";
            }
            fs.writeFileSync(this.name + "-categories.txt", output, "utf-8");
        }
        constructIndexesInMemory() {
            let terms = this.constructTerms(TermType_1.TermType.TOKEN);
            this.dictionary = new TermDictionary_1.TermDictionary(this.comparator, terms);
            switch (this.indexType) {
                case IndexType_1.IndexType.INCIDENCE_MATRIX:
                    this.incidenceMatrix = new IncidenceMatrix_1.IncidenceMatrix(this.documents.length, terms, this.dictionary);
                    break;
                case IndexType_1.IndexType.INVERTED_INDEX:
                    this.invertedIndex = new InvertedIndex_1.InvertedIndex(this.dictionary, terms, this.comparator);
                    if (this.parameter.constructPositionalIndex()) {
                        this.positionalIndex = new PositionalIndex_1.PositionalIndex(this.dictionary, terms, this.comparator);
                    }
                    if (this.parameter.constructPhraseIndex()) {
                        terms = this.constructTerms(TermType_1.TermType.PHRASE);
                        this.phraseDictionary = new TermDictionary_1.TermDictionary(this.comparator, terms);
                        this.phraseIndex = new InvertedIndex_1.InvertedIndex(this.phraseDictionary, terms, this.comparator);
                        if (this.parameter.constructPositionalIndex()) {
                            this.phrasePositionalIndex = new PositionalIndex_1.PositionalIndex(this.phraseDictionary, terms, this.comparator);
                        }
                    }
                    if (this.parameter.constructNGramIndex()) {
                        this.constructNGramIndex();
                    }
                    if (this.parameter.getDocumentType() == DocumentType_1.DocumentType.CATEGORICAL) {
                        this.categoryTree = new CategoryTree_1.CategoryTree(this.name);
                        for (let document of this.documents) {
                            document.loadCategory(this.categoryTree);
                        }
                    }
                    break;
            }
        }
        constructTerms(termType) {
            let terms = new Array();
            for (let doc of this.documents) {
                let documentText = doc.loadDocument();
                let docTerms = documentText.constructTermList(doc.getDocId(), termType);
                terms = terms.concat(docTerms);
            }
            terms.sort(this.termComparator(this.comparator));
            return terms;
        }
        attributeSearch(query, parameter) {
            let termAttributes = new Query_1.Query();
            let phraseAttributes = new Query_1.Query();
            let termResult = new QueryResult_1.QueryResult(), phraseResult = new QueryResult_1.QueryResult();
            let attributeResult, filteredResult;
            let filteredQuery = query.filterAttributes(this.attributeList, termAttributes, phraseAttributes);
            if (termAttributes.size() > 0) {
                termResult = this.invertedIndex.search(termAttributes, this.dictionary);
            }
            if (phraseAttributes.size() > 0) {
                phraseResult = this.phraseIndex.search(phraseAttributes, this.phraseDictionary);
            }
            if (termAttributes.size() == 0) {
                attributeResult = phraseResult;
            }
            else {
                if (phraseAttributes.size() == 0) {
                    attributeResult = termResult;
                }
                else {
                    attributeResult = termResult.intersectionFastSearch(phraseResult);
                }
            }
            if (filteredQuery.size() == 0) {
                return attributeResult;
            }
            else {
                if (parameter.getRetrievalType() != RetrievalType_1.RetrievalType.RANKED) {
                    filteredResult = this.searchWithInvertedIndex(filteredQuery, parameter);
                    return filteredResult.intersectionFastSearch(attributeResult);
                }
                else {
                    filteredResult = this.positionalIndex.rankedSearch(filteredQuery, this.dictionary, this.documents, parameter);
                    if (attributeResult.size() < 10) {
                        filteredResult = filteredResult.intersectionLinearSearch(attributeResult);
                    }
                    else {
                        filteredResult = filteredResult.intersectionBinarySearch(attributeResult);
                    }
                    filteredResult.getBest(parameter.getDocumentsRetrieved());
                    return filteredResult;
                }
            }
        }
        searchWithInvertedIndex(query, searchParameter) {
            switch (searchParameter.getRetrievalType()) {
                case RetrievalType_1.RetrievalType.BOOLEAN:
                    return this.invertedIndex.search(query, this.dictionary);
                case RetrievalType_1.RetrievalType.POSITIONAL:
                    return this.positionalIndex.positionalSearch(query, this.dictionary);
                case RetrievalType_1.RetrievalType.RANKED:
                    let result = this.positionalIndex.rankedSearch(query, this.dictionary, this.documents, searchParameter);
                    result.getBest(searchParameter.getDocumentsRetrieved());
                    return result;
            }
            return new QueryResult_1.QueryResult();
        }
        filterAccordingToCategories(currentResult, categories) {
            let filteredResult = new QueryResult_1.QueryResult();
            let items = currentResult.getItems();
            for (let queryResultItem of items) {
                let categoryNode = this.documents[queryResultItem.getDocId()].getCategoryNode();
                for (let possibleAncestor of categories) {
                    if (categoryNode.isDescendant(possibleAncestor)) {
                        filteredResult.add(queryResultItem.getDocId(), queryResultItem.getScore());
                        break;
                    }
                }
            }
            return filteredResult;
        }
        autoCompleteWord(prefix) {
            let result = new Array();
            let i = this.dictionary.getWordStartingWith(prefix);
            if (i < 0) {
                i = -(i + 1);
            }
            while (i < this.dictionary.size()) {
                if (this.dictionary.getWord(i).getName().startsWith(prefix)) {
                    result.push(this.dictionary.getWord(i).getName());
                }
                else {
                    break;
                }
                i++;
            }
            this.invertedIndex.autoCompleteWord(result, this.dictionary);
            return result;
        }
        searchCollection(query, searchParameter) {
            let currentResult;
            if (searchParameter.getFocusType() == FocusType_1.FocusType.CATEGORY) {
                if (searchParameter.getSearchAttributes()) {
                    currentResult = this.attributeSearch(query, searchParameter);
                }
                else {
                    currentResult = this.searchWithInvertedIndex(query, searchParameter);
                }
                let categories = this.categoryTree.getCategories(query, this.dictionary, searchParameter.getCategoryDeterminationType());
                return this.filterAccordingToCategories(currentResult, categories);
            }
            else {
                switch (this.indexType) {
                    case IndexType_1.IndexType.INCIDENCE_MATRIX:
                        return this.incidenceMatrix.search(query, this.dictionary);
                    case IndexType_1.IndexType.INVERTED_INDEX:
                        if (searchParameter.getSearchAttributes()) {
                            return this.attributeSearch(query, searchParameter);
                        }
                        else {
                            return this.searchWithInvertedIndex(query, searchParameter);
                        }
                }
            }
            return new QueryResult_1.QueryResult();
        }
    }
    exports.MemoryCollection = MemoryCollection;
});
//# sourceMappingURL=MemoryCollection.js.map