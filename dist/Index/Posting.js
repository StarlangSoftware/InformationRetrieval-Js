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
    exports.Posting = void 0;
    class Posting {
        constructor(id) {
            this.id = id;
        }
        getId() {
            return this.id;
        }
    }
    exports.Posting = Posting;
});
//# sourceMappingURL=Posting.js.map