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
    exports.IndexType = void 0;
    var IndexType;
    (function (IndexType) {
        IndexType[IndexType["INCIDENCE_MATRIX"] = 0] = "INCIDENCE_MATRIX";
        IndexType[IndexType["INVERTED_INDEX"] = 1] = "INVERTED_INDEX";
    })(IndexType = exports.IndexType || (exports.IndexType = {}));
});
//# sourceMappingURL=IndexType.js.map