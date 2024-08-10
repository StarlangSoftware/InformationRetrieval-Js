(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-datastructure/dist/CounterHashMap", "./Term"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CategoryNode = void 0;
    const CounterHashMap_1 = require("nlptoolkit-datastructure/dist/CounterHashMap");
    const Term_1 = require("./Term");
    class CategoryNode {
        /**
         * Constructor for the category node. Each category is represented as a tree node in the category tree. Category
         * words are constructed by splitting the name of the category w.r.t. space. Sets the parent node and adds this
         * node as a child to parent node.
         * @param name Name of the category.
         * @param parent Parent node of this node.
         */
        constructor(name, parent) {
            this.children = new Array();
            this.counts = new CounterHashMap_1.CounterHashMap();
            this.categoryWords = new Array();
            this.categoryWords = name.split(" ");
            this.parent = parent;
            if (parent != null) {
                parent.addChild(this);
            }
        }
        /**
         * Adds the given child node to this node.
         * @param child New child node
         */
        addChild(child) {
            this.children.push(child);
        }
        /**
         * Constructs the category name from the category words. Basically combines all category words separated with space.
         * @return Category name.
         */
        getName() {
            let result = this.categoryWords[0];
            for (let i = 1; i < this.categoryWords.length; i++) {
                result += " " + this.categoryWords[i];
            }
            return result;
        }
        /**
         * Searches the children of this node for a specific category name.
         * @param childName Category name of the child.
         * @return The child with the given category name.
         */
        getChild(childName) {
            for (let child of this.children) {
                if (child.getName() == childName) {
                    return child;
                }
            }
            return null;
        }
        /**
         * Adds frequency count of the term to the counts hash map of all ascendants of this node.
         * @param termId ID of the occurring term.
         * @param count Frequency of the term.
         */
        addCounts(termId, count) {
            let current = this;
            while (current.parent != null) {
                current.counts.putNTimes(termId, count);
                current = current.parent;
            }
        }
        /**
         * Checks if the given node is an ancestor of the current node.
         * @param ancestor Node for which ancestor check will be done
         * @return True, if the given node is an ancestor of the current node.
         */
        isDescendant(ancestor) {
            if (this == ancestor) {
                return true;
            }
            if (this.parent == null) {
                return false;
            }
            return this.parent.isDescendant(ancestor);
        }
        /**
         * Accessor of the children attribute
         * @return Children of the node
         */
        getChildren() {
            return this.children;
        }
        /**
         * Recursive method that returns the hierarchy string of the node. Hierarchy string is obtained by concatenating the
         * names of all ancestor nodes separated with '%'.
         * @return Hierarchy string of this node
         */
        toString() {
            if (this.parent != null) {
                if (this.parent.parent != null) {
                    return this.parent.toString() + "%" + this.getName();
                }
                else {
                    return this.getName();
                }
            }
            return "";
        }
        /**
         * Recursive method that sets the representative count. The representative count filters the most N frequent words.
         * @param representativeCount Number of representatives.
         */
        setRepresentativeCount(representativeCount) {
            if (representativeCount <= this.counts.size) {
                let topList = this.counts.topN(representativeCount);
                this.counts = new CounterHashMap_1.CounterHashMap();
                for (let item of topList) {
                    this.counts.putNTimes(item[0], item[1]);
                }
            }
        }
        /**
         * Recursive method that checks the query words in the category words of all descendants of this node and
         * accumulates the nodes that satisfies the condition. If any word  in the query appears in any category word, the
         * node will be accumulated.
         * @param query Query string
         * @param result Accumulator array
         */
        getCategoriesWithKeyword(query, result) {
            let categoryScore = 0;
            for (let i = 0; i < query.size(); i++) {
                if (this.categoryWords.includes(query.getTerm(i).getName())) {
                    categoryScore++;
                }
            }
            if (categoryScore > 0) {
                result.push(this);
            }
            for (let child of this.children) {
                child.getCategoriesWithKeyword(query, result);
            }
        }
        /**
         * Recursive method that checks the query words in the category words of all descendants of this node and
         * accumulates the nodes that satisfies the condition. If any word  in the query appears in any category word, the
         * node will be accumulated.
         * @param query Query string
         * @param dictionary Term dictionary
         * @param result Accumulator array
         */
        getCategoriesWithCosine(query, dictionary, result) {
            let categoryScore = 0;
            for (let i = 0; i < query.size(); i++) {
                let term = dictionary.getWord(query.getTerm(i).getName());
                if (term != undefined && term instanceof Term_1.Term) {
                    categoryScore += this.counts.count(term.getTermId());
                }
            }
            if (categoryScore > 0) {
                result.push(this);
            }
            for (let child of this.children) {
                child.getCategoriesWithCosine(query, dictionary, result);
            }
        }
    }
    exports.CategoryNode = CategoryNode;
});
//# sourceMappingURL=CategoryNode.js.map