(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Posting"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PositionalPosting = void 0;
    const Posting_1 = require("./Posting");
    class PositionalPosting {
        constructor(docId) {
            this.positions = new Array();
            this.docId = docId;
        }
        add(position) {
            this.positions.push(new Posting_1.Posting(position));
        }
        getDocId() {
            return this.docId;
        }
        getPositions() {
            return this.positions;
        }
        size() {
            return this.positions.length;
        }
        toString() {
            let result = this.docId + " " + this.positions.length;
            for (let posting of this.positions) {
                result = result + " " + posting.getId();
            }
            return result;
        }
    }
    exports.PositionalPosting = PositionalPosting;
});
//# sourceMappingURL=PositionalPosting.js.map