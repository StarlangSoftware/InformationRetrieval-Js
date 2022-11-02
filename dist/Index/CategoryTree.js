(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./CategoryNode"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CategoryTree = void 0;
    const CategoryNode_1 = require("./CategoryNode");
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
        topNString(dictionary, N) {
            let queue = new Array();
            queue.push(this.root);
            let result = "";
            while (queue.length > 0) {
                let node = queue[0];
                queue.splice(0, 1);
                if (node != this.root) {
                    result += node.topNString(dictionary, N) + "\n";
                }
                for (let child of node.getChildren()) {
                    queue.push(child);
                }
            }
            return result;
        }
    }
    exports.CategoryTree = CategoryTree;
});
//# sourceMappingURL=CategoryTree.js.map