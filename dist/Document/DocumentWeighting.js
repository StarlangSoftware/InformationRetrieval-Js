(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DocumentWeighting = void 0;
    var DocumentWeighting;
    (function (DocumentWeighting) {
        DocumentWeighting[DocumentWeighting["NO_IDF"] = 0] = "NO_IDF";
        DocumentWeighting[DocumentWeighting["IDF"] = 1] = "IDF";
        DocumentWeighting[DocumentWeighting["PROBABILISTIC_IDF"] = 2] = "PROBABILISTIC_IDF";
    })(DocumentWeighting = exports.DocumentWeighting || (exports.DocumentWeighting = {}));
});
//# sourceMappingURL=DocumentWeighting.js.map