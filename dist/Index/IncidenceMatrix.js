(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../Query/QueryResult"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IncidenceMatrix = void 0;
    const QueryResult_1 = require("../Query/QueryResult");
    class IncidenceMatrix {
        constructor(documentSize, termsOrSize, dictionary) {
            this.incidenceMatrix = new Array();
            this.documentSize = documentSize;
            if (dictionary == undefined) {
                this.dictionarySize = termsOrSize;
                for (let i = 0; i < this.dictionarySize; i++) {
                    this.incidenceMatrix.push(new Array());
                }
            }
            else {
                if (termsOrSize instanceof Array) {
                    this.dictionarySize = dictionary.size();
                    for (let i = 0; i < this.dictionarySize; i++) {
                        this.incidenceMatrix.push(new Array());
                    }
                    let terms = termsOrSize;
                    if (terms.length > 0) {
                        let term = terms[0];
                        let i = 1;
                        this.set(dictionary.getWordIndex(term.getTerm().getName()), term.getDocId());
                        while (i < terms.length) {
                            term = terms[i];
                            this.set(dictionary.getWordIndex(term.getTerm().getName()), term.getDocId());
                            i++;
                        }
                    }
                }
            }
        }
        set(row, col) {
            this.incidenceMatrix[row][col] = true;
        }
        search(query, dictionary) {
            let result = new QueryResult_1.QueryResult();
            let resultRow = new Array();
            for (let i = 0; i < this.documentSize; i++) {
                resultRow.push(true);
            }
            for (let i = 0; i < query.size(); i++) {
                let termIndex = dictionary.getWordIndex(query.getTerm(i).getName());
                if (termIndex != -1) {
                    for (let j = 0; j < this.documentSize; j++) {
                        resultRow[j] = resultRow[j] && this.incidenceMatrix[termIndex][j];
                    }
                }
                else {
                    return result;
                }
            }
            for (let i = 0; i < this.documentSize; i++) {
                if (resultRow[i]) {
                    result.add(i);
                }
            }
            return result;
        }
    }
    exports.IncidenceMatrix = IncidenceMatrix;
});
//# sourceMappingURL=IncidenceMatrix.js.map