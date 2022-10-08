import * as assert from "assert";
import {Parameter} from "../dist/Document/Parameter";
import {IndexType} from "../dist/Document/IndexType";
import {Collection} from "../dist/Document/Collection";
import {Query} from "../dist/Query/Query";
import {RetrievalType} from "../dist/Query/RetrievalType";

describe('CollectionTest', function() {
    describe('CollectionTest', function () {
        let parameter = new Parameter()
        it('testIncidenceMatrixSmall', function () {
            parameter.setIndexType(IndexType.INCIDENCE_MATRIX)
            let collection = new Collection("testCollection2", parameter)
            assert.strictEqual(2, collection.size())
            assert.strictEqual(26, collection.vocabularySize())
        });
        it('testIncidenceMatrixQuery', function () {
            parameter.setIndexType(IndexType.INCIDENCE_MATRIX)
            let collection = new Collection("testCollection2", parameter)
            let query = new Query("Brutus")
            let result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("Brutus Caesar")
            result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("enact")
            result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("noble")
            result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("a")
            result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(0, result.getItems().length)
        });
        it('testInvertedIndexBooleanQuery', function () {
            parameter.setNGramIndex(true)
            let collection = new Collection("testCollection2", parameter)
            let query = new Query("Brutus")
            let result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("Brutus Caesar")
            result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("enact")
            result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("noble")
            result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("a")
            result = collection.searchCollection(query, RetrievalType.BOOLEAN)
            assert.strictEqual(0, result.getItems().length)
        });
        it('testPositionalIndexBooleanQuery', function () {
            parameter.setNGramIndex(true)
            let collection = new Collection("testCollection2", parameter)
            let query = new Query("Julius Caesar")
            let result = collection.searchCollection(query, RetrievalType.POSITIONAL)
            assert.strictEqual(2, result.getItems().length)
            query = new Query("I was killed")
            result = collection.searchCollection(query, RetrievalType.POSITIONAL)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("The noble Brutus")
            result = collection.searchCollection(query, RetrievalType.POSITIONAL)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("a")
            result = collection.searchCollection(query, RetrievalType.POSITIONAL)
            assert.strictEqual(0, result.getItems().length)
        });
        it('testPositionalIndexRankedQuery', function () {
            parameter.setLoadIndexesFromFile(true)
            let collection = new Collection("testCollection2", parameter)
            let query = new Query("Caesar")
            let result = collection.searchCollection(query, RetrievalType.RANKED)
            assert.strictEqual(2, result.getItems().length)
            assert.strictEqual(1, result.getItems()[0].getDocId())
            query = new Query("Caesar was killed")
            result = collection.searchCollection(query, RetrievalType.RANKED)
            assert.strictEqual(2, result.getItems().length)
            assert.strictEqual(0, result.getItems()[0].getDocId())
            query = new Query("in the Capitol")
            result = collection.searchCollection(query, RetrievalType.RANKED)
            assert.strictEqual(1, result.getItems().length)
            query = new Query("a")
            result = collection.searchCollection(query, RetrievalType.RANKED)
            assert.strictEqual(0, result.getItems().length)
        });
        it('testSaveIndexesToFileSmall', function () {
            parameter.setNGramIndex(true)
            let collection = new Collection("testCollection2", parameter)
            collection.save()
        });
        it('testLoadIndexesFromFileSmall', function () {
            parameter.setNGramIndex(true)
            parameter.setLoadIndexesFromFile(true)
            let collection = new Collection("testCollection2", parameter)
            assert.strictEqual(2, collection.size())
            assert.strictEqual(26, collection.vocabularySize())
        });
        it('testConstructIndexesInDiskSmall', function () {
            parameter.setConstructIndexInDisk(true)
            parameter.setNGramIndex(false)
            parameter.setDocumentLimit(1)
            let collection = new Collection("testCollection2", parameter)
        });
        it('testLimitNumberOfDocumentsSmall', function () {
            parameter.setConstructIndexInDisk(true)
            parameter.setNGramIndex(false)
            parameter.setLimitNumberOfDocumentsLoaded(true)
            parameter.setDocumentLimit(1)
            let collection = new Collection("testCollection2", parameter)
            assert.strictEqual(1, collection.size())
            assert.strictEqual(15, collection.vocabularySize())
        });
        it('testConstructDictionaryAndIndexesInDiskSmall', function () {
            parameter.setConstructDictionaryInDisk(true)
            parameter.setDocumentLimit(1)
            parameter.setWordLimit(10)
            let collection = new Collection("testCollection2", parameter)
        });
    });
})
