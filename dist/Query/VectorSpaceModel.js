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
        get(index) {
            return this.model[index];
        }
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
        static weighting(termFrequency, documentFrequency, documentSize, termWeighting, documentWeighting) {
            let multiplier1 = 1, multiplier2 = 1;
            switch (termWeighting) {
                case TermWeighting_1.TermWeighting.NATURAL:
                    multiplier1 = termFrequency;
                    break;
                case TermWeighting_1.TermWeighting.LOGARITHM:
                    if (termFrequency > 0)
                        multiplier1 = 1 + Math.log(termFrequency);
                    else
                        multiplier1 = 0;
                    break;
                case TermWeighting_1.TermWeighting.BOOLE:
                    if (termFrequency > 0) {
                        multiplier1 = 1;
                    }
                    else {
                        multiplier1 = 0;
                    }
            }
            switch (documentWeighting) {
                case DocumentWeighting_1.DocumentWeighting.NO_IDF:
                    multiplier2 = 1;
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