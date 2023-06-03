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
    exports.RetrievalType = void 0;
    var RetrievalType;
    (function (RetrievalType) {
        RetrievalType[RetrievalType["BOOLEAN"] = 0] = "BOOLEAN";
        RetrievalType[RetrievalType["POSITIONAL"] = 1] = "POSITIONAL";
        RetrievalType[RetrievalType["RANKED"] = 2] = "RANKED";
    })(RetrievalType = exports.RetrievalType || (exports.RetrievalType = {}));
});
//# sourceMappingURL=RetrievalType.js.map