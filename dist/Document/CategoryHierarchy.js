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
    exports.CategoryHierarchy = void 0;
    class CategoryHierarchy {
        constructor(list) {
            this.categoryList = list.split("%");
        }
        toString() {
            let result = this.categoryList[0];
            for (let i = 1; i < this.categoryList.length; i++) {
                result = result + this.categoryList[i];
            }
            return result;
        }
    }
    exports.CategoryHierarchy = CategoryHierarchy;
});
//# sourceMappingURL=CategoryHierarchy.js.map