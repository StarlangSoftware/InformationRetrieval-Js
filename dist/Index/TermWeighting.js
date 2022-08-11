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
    exports.TermWeighting = void 0;
    var TermWeighting;
    (function (TermWeighting) {
        TermWeighting[TermWeighting["NATURAL"] = 0] = "NATURAL";
        TermWeighting[TermWeighting["LOGARITHM"] = 1] = "LOGARITHM";
        TermWeighting[TermWeighting["BOOLE"] = 2] = "BOOLE";
    })(TermWeighting = exports.TermWeighting || (exports.TermWeighting = {}));
});
//# sourceMappingURL=TermWeighting.js.map