import * as assert from "assert";
import {Parameter} from "../dist/Document/Parameter";
import {IndexType} from "../dist/Document/IndexType";
import {Collection} from "../dist/Document/Collection";
import {Query} from "../dist/Query/Query";
import {RetrievalType} from "../dist/Query/RetrievalType";
import {SearchParameter} from "../dist/Query/SearchParameter";

describe('CollectionTest', function() {
    describe('CollectionTest', function () {
        it('testIncidenceMatrixSmall', function () {
            let parameter = new Parameter()
            parameter.setIndexType(IndexType.INCIDENCE_MATRIX)
            let collection = new Collection("testCollection2", parameter)
            assert.strictEqual(2, collection.size())
            assert.strictEqual(26, collection.vocabularySize())
        });
        it('testIncidenceMatrixQuery', function () {
            let parameter = new Parameter()
            parameter.setIndexType(IndexType.INCIDENCE_MATRIX)
            let collection = new Collection("testCollection2", parameter)
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
            let collection = new Collection("testCollection2", parameter)
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
            let collection = new Collection("testCollection2", parameter)
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
            let collection = new Collection("testCollection2", parameter)
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
            let collection = new Collection("testCollection2", parameter)
            assert.strictEqual(2, collection.size())
            assert.strictEqual(26, collection.vocabularySize())
        });
        it('testLimitNumberOfDocumentsSmall', function () {
            let parameter = new Parameter()
            parameter.setNGramIndex(false)
            parameter.setLimitNumberOfDocumentsLoaded(true)
            parameter.setDocumentLimit(1)
            let collection = new Collection("testCollection2", parameter)
            assert.strictEqual(1, collection.size())
            assert.strictEqual(15, collection.vocabularySize())
        });
    });
})
