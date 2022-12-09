(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./CategoryNode", "../Query/CategoryDeterminationType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CategoryTree = void 0;
    const CategoryNode_1 = require("./CategoryNode");
    const CategoryDeterminationType_1 = require("../Query/CategoryDeterminationType");
    class CategoryTree {
        constructor(rootName) {
            this.root = new CategoryNode_1.CategoryNode(rootName, null);
        }
        addCategoryHierarchy(hierarchy) {
            let categories = hierarchy.split("%");
            let current = this.root;
            for (let category of categories) {
                let node = current.getChild(category);
                if (node == null) {
                    node = new CategoryNode_1.CategoryNode(category, current);
                }
                current = node;
            }
            return current;
        }
        getCategories(query, dictionary, categoryDeterminationType) {
            let result = new Array();
            switch (categoryDeterminationType) {
                case CategoryDeterminationType_1.CategoryDeterminationType.KEYWORD:
                    this.root.getCategoriesWithKeyword(query, result);
                    break;
                case CategoryDeterminationType_1.CategoryDeterminationType.COSINE:
                    this.root.getCategoriesWithCosine(query, dictionary, result);
                    break;
            }
            return result;
        }
        setRepresentativeCount(representativeCount) {
            this.root.setRepresentativeCount(representativeCount);
        }
    }
    exports.CategoryTree = CategoryTree;
});
//# sourceMappingURL=CategoryTree.js.map