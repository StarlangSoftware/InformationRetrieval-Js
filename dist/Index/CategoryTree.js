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
        /**
         * Simple constructor of the tree. Sets the root node of the tree.
         * @param rootName Category name of the root node.
         */
        constructor(rootName) {
            this.root = new CategoryNode_1.CategoryNode(rootName, null);
        }
        /**
         * Adds a path (and if required nodes in the path) to the category tree according to the hierarchy string. Hierarchy
         * string is obtained by concatenating the names of all nodes in the path from root node to a leaf node separated
         * with '%'.
         * @param hierarchy Hierarchy string
         * @return The leaf node added when the hierarchy string is processed.
         */
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
        /**
         * The method checks the query words in the category words of all nodes in the tree and returns the nodes that
         * satisfies the condition. If any word in the query appears in any category word, the node will be returned.
         * @param query Query string
         * @param dictionary Term dictionary
         * @param categoryDeterminationType Category determination type
         * @return The category nodes whose names contain at least one word from the query string
         */
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
        /**
         * The method sets the representative count. The representative count filters the most N frequent words.
         * @param representativeCount Number of representatives.
         */
        setRepresentativeCount(representativeCount) {
            this.root.setRepresentativeCount(representativeCount);
        }
    }
    exports.CategoryTree = CategoryTree;
});
//# sourceMappingURL=CategoryTree.js.map