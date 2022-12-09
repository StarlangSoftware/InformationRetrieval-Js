import * as assert from "assert";
import {Parameter} from "../dist/Document/Parameter";
import {IndexType} from "../dist/Document/IndexType";
import {Query} from "../dist/Query/Query";
import {RetrievalType} from "../dist/Query/RetrievalType";
import {DocumentType} from "../dist/Document/DocumentType";
import {SearchParameter} from "../dist/Query/SearchParameter";
import {MemoryCollection} from "../dist/Document/MemoryCollection";
import {FocusType} from "../dist/Query/FocusType";

describe('CollectionTest', function() {
    describe('CollectionTest', function () {
        it('testIncidenceMatrixSmall', function () {
            let parameter = new Parameter()
            parameter.setIndexType(IndexType.INCIDENCE_MATRIX)
            let collection = new MemoryCollection("testCollection2", parameter)
            assert.strictEqual(2, collection.size())
            assert.strictEqual(26, collection.vocabularySize())
        });
        it('testIncidenceMatrixQuery', function () {
            let parameter = new Parameter()
            parameter.setIndexType(IndexType.INCIDENCE_MATRIX)
            let collection = new MemoryCollection("testCollection2", parameter)
            let query = new Query("Brutus")
            let searchParameter = new SearchParameter()
            searchParameter.setRetrievalType(RetrievalType.BOOLEAN)
            let result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("Brutus Caesar")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("enact")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("noble")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("a")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(0, result.getItems().length)
        });
        it('testInvertedIndexBooleanQuery', function () {
            let parameter = new Parameter()
            parameter.setNGramIndex(true)
            let collection = new MemoryCollection("testCollection2", parameter)
            let query = new Query("Brutus")
            let searchParameter = new SearchParameter()
            searchParameter.setRetrievalType(RetrievalType.BOOLEAN)
            let result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("Brutus Caesar")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("enact")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("noble")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("a")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(0, result.getItems().length)
        });
        it('testPositionalIndexBooleanQuery', function () {
            let parameter = new Parameter()
            parameter.setNGramIndex(true)
            let collection = new MemoryCollection("testCollection2", parameter)
            let query = new Query("Julius Caesar")
            let searchParameter = new SearchParameter()
            searchParameter.setRetrievalType(RetrievalType.POSITIONAL)
            let result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("I was killed")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("The noble Brutus")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("a")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(0, result.getItems().length)
        });
        it('testPositionalIndexRankedQuery', function () {
            let parameter = new Parameter()
            parameter.setLoadIndexesFromFile(true)
            let collection = new MemoryCollection("testCollection2", parameter)
            let query = new Query("Caesar")
            let searchParameter = new SearchParameter()
            searchParameter.setRetrievalType(RetrievalType.RANKED)
            searchParameter.setDocumentsRetrieved(2)
            let result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(2, result.getItems().length)
            assert.strictEqual(1, result.getItems()[0].getDocId())
            query = new Query("Caesar was killed")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(2, result.getItems().length)
            assert.strictEqual(0, result.getItems()[0].getDocId())
            query = new Query("in the Capitol")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("a")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(0, result.getItems().length)
        });
        it('testLoadIndexesFromFileSmall', function () {
            let parameter = new Parameter()
            parameter.setNGramIndex(true)
            parameter.setLoadIndexesFromFile(true)
            let collection = new MemoryCollection("testCollection2", parameter)
            assert.strictEqual(2, collection.size())
            assert.strictEqual(26, collection.vocabularySize())
        });
        it('testLimitNumberOfDocumentsSmall', function () {
            let parameter = new Parameter()
            parameter.setNGramIndex(false)
            parameter.setLimitNumberOfDocumentsLoaded(true)
            parameter.setDocumentLimit(1)
            let collection = new MemoryCollection("testCollection2", parameter)
            assert.strictEqual(1, collection.size())
            assert.strictEqual(15, collection.vocabularySize())
        });
        it('testCategoricalCollection', function () {
            let parameter = new Parameter()
            parameter.setDocumentType(DocumentType.CATEGORICAL)
            parameter.setLoadIndexesFromFile(true)
            parameter.setPhraseIndex(false)
            parameter.setNGramIndex(false)
            let collection = new MemoryCollection("testCollection3", parameter)
            assert.strictEqual(1000, collection.size())
            assert.strictEqual(2283, collection.vocabularySize())
        });
        it('testAttributeQuery', function () {
            let parameter = new Parameter()
            parameter.setDocumentType(DocumentType.CATEGORICAL)
            parameter.setLoadIndexesFromFile(true)
            let collection = new MemoryCollection("testCollection3", parameter)
            let searchParameter = new SearchParameter()
            searchParameter.setRetrievalType(RetrievalType.ATTRIBUTE)
            let query = new Query("Çift Yönlü")
            let result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(10, result.getItems().length)
            query = new Query("Müzikli")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(4, result.getItems().length)
            query = new Query("Çift Yönlü Alüminyum Bebek Arabası")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(2, result.getItems().length)
        });
        it('testCategoricalQuery', function () {
            let parameter = new Parameter()
            parameter.setDocumentType(DocumentType.CATEGORICAL)
            parameter.setLoadIndexesFromFile(true)
            let collection = new MemoryCollection("testCollection3", parameter)
            let searchParameter = new SearchParameter()
            searchParameter.setFocusType(FocusType.CATEGORY)
            searchParameter.setRetrievalType(RetrievalType.BOOLEAN)
            let query = new Query("Çift Yönlü Bebek Arabası")
            let result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(10, result.getItems().length)
            searchParameter.setRetrievalType(RetrievalType.BOOLEAN)
            query = new Query("Terlik")
            result = collection.searchCollection(query, searchParameter)
            assert.strictEqual(5, result.getItems().length)
        });
    });
})
