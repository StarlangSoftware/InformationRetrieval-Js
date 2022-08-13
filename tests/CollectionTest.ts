import * as assert from "assert";
import {Parameter} from "../dist/Document/Parameter";
import {IndexType} from "../dist/Document/IndexType";
import {Collection} from "../dist/Document/Collection";

describe('CollectionTest', function() {
    describe('CollectionTest', function () {
        let parameter = new Parameter()
        it('testIncidenceMatrixSmall', function () {
            parameter.setIndexType(IndexType.INCIDENCE_MATRIX)
            let collection = new Collection("testCollection2", parameter)
            assert.strictEqual(2, collection.size())
            assert.strictEqual(26, collection.vocabularySize())
        });
        it('testSaveIndexesToFileSmall', function () {
            parameter.setNGramIndex(true)
            let collection = new Collection("testCollection2", parameter)
            collection.save()
        });
    });
})
