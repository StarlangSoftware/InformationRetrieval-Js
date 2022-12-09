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
    exports.CategoryDeterminationType = void 0;
    var CategoryDeterminationType;
    (function (CategoryDeterminationType) {
        CategoryDeterminationType[CategoryDeterminationType["KEYWORD"] = 0] = "KEYWORD";
        CategoryDeterminationType[CategoryDeterminationType["COSINE"] = 1] = "COSINE";
    })(CategoryDeterminationType = exports.CategoryDeterminationType || (exports.CategoryDeterminationType = {}));
});
//# sourceMappingURL=CategoryDeterminationType.js.map