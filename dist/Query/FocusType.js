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
    exports.FocusType = void 0;
    var FocusType;
    (function (FocusType) {
        FocusType[FocusType["OVERALL"] = 0] = "OVERALL";
        FocusType[FocusType["CATEGORY"] = 1] = "CATEGORY";
    })(FocusType = exports.FocusType || (exports.FocusType = {}));
});
//# sourceMappingURL=FocusType.js.map