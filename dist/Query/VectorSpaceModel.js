(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../Index/TermWeighting", "../Document/DocumentWeighting"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectorSpaceModel = void 0;
    const TermWeighting_1 = require("../Index/TermWeighting");
    const DocumentWeighting_1 = require("../Document/DocumentWeighting");
    class VectorSpaceModel {
        /**
         * Constructor for the VectorSpaceModel class. Calculates the normalized tf-idf vector of a single document.
         * @param termFrequencies Term frequencies in the document
         * @param documentFrequencies Document frequencies of terms.
         * @param documentSize Number of documents in the collection
         * @param termWeighting Term weighting scheme applied in term frequency calculation.
         * @param documentWeighting Document weighting scheme applied in document frequency calculation.
         */
        constructor(termFrequencies, documentFrequencies, documentSize, termWeighting, documentWeighting) {
            this.model = new Array();
            let sum = 0;
            for (let i = 0; i < termFrequencies.length; i++) {
                this.model.push(VectorSpaceModel.weighting(termFrequencies[i], documentFrequencies[i], documentSize, termWeighting, documentWeighting));
                sum += this.model[i] * this.model[i];
            }
            for (let i = 0; i < termFrequencies.length; i++) {
                this.model[i] /= Math.sqrt(sum);
            }
        }
        /**
         * Returns the tf-idf value for a column at position index
         * @param index Position of the column
         * @return tf-idf value for a column at position index
         */
        get(index) {
            return this.model[index];
        }
        /**
         * Calculates the cosine similarity between this document vector and the given second document vector.
         * @param secondModel Document vector of the second document.
         * @return Cosine similarity between this document vector and the given second document vector.
         */
        cosineSimilarity(secondModel) {
            let sum = 0.0;
            if (this.model.length != secondModel.model.length) {
                return 0.0;
            }
            else {
                for (let i = 0; i < this.model.length; i++) {
                    sum += this.model[i] * secondModel.model[i];
                }
            }
            return sum;
        }
        /**
         * Calculates tf-idf value of a single word (column) of the document vector.
         * @param termFrequency Term frequency of this word in the document
         * @param documentFrequency Document frequency of this word.
         * @param documentSize Number of documents in the collection
         * @param termWeighting Term weighting scheme applied in term frequency calculation.
         * @param documentWeighting Document weighting scheme applied in document frequency calculation.
         * @return tf-idf value of a single word (column) of the document vector.
         */
        static weighting(termFrequency, documentFrequency, documentSize, termWeighting, documentWeighting) {
            let multiplier1 = 1.0, multiplier2 = 1.0;
            switch (termWeighting) {
                case TermWeighting_1.TermWeighting.NATURAL:
                    multiplier1 = termFrequency;
                    break;
                case TermWeighting_1.TermWeighting.LOGARITHM:
                    if (termFrequency > 0)
                        multiplier1 = 1.0 + Math.log(termFrequency);
                    else
                        multiplier1 = 0.0;
                    break;
                case TermWeighting_1.TermWeighting.BOOLE:
                    if (termFrequency > 0) {
                        multiplier1 = 1.0;
                    }
                    else {
                        multiplier1 = 0.0;
                    }
            }
            switch (documentWeighting) {
                case DocumentWeighting_1.DocumentWeighting.NO_IDF:
                    multiplier2 = 1.0;
                    break;
                case DocumentWeighting_1.DocumentWeighting.IDF:
                    multiplier2 = Math.log(documentSize / documentFrequency);
                    break;
                case DocumentWeighting_1.DocumentWeighting.PROBABILISTIC_IDF:
                    if (documentSize > 2 * documentFrequency) {
                        multiplier2 = Math.log((documentSize - documentFrequency) / documentFrequency);
                    }
                    else {
                        multiplier2 = 0.0;
                    }
                    break;
            }
            return multiplier1 * multiplier2;
        }
    }
    exports.VectorSpaceModel = VectorSpaceModel;
});
//# sourceMappingURL=VectorSpaceModel.js.map