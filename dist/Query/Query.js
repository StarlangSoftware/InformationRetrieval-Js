(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-dictionary/dist/Dictionary/Word"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Query = void 0;
    const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
    class Query {
        constructor(query) {
            this.terms = new Array();
            let terms = query.split(" ");
            for (let term of terms) {
                this.terms.push(new Word_1.Word(term));
            }
        }
        getTerm(index) {
            return this.terms[index];
        }
        size() {
            return this.terms.length;
        }
    }
    exports.Query = Query;
});
//# sourceMappingURL=Query.js.map