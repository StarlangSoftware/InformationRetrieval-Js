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
    exports.TermType = void 0;
    var TermType;
    (function (TermType) {
        TermType[TermType["TOKEN"] = 0] = "TOKEN";
        TermType[TermType["PHRASE"] = 1] = "PHRASE";
    })(TermType = exports.TermType || (exports.TermType = {}));
});
//# sourceMappingURL=TermType.js.map