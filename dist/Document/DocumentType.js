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
    exports.DocumentType = void 0;
    var DocumentType;
    (function (DocumentType) {
        DocumentType[DocumentType["NORMAL"] = 0] = "NORMAL";
        DocumentType[DocumentType["CATEGORICAL"] = 1] = "CATEGORICAL";
    })(DocumentType = exports.DocumentType || (exports.DocumentType = {}));
});
//# sourceMappingURL=DocumentType.js.map