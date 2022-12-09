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
        addChild(child) {
            this.children.push(child);
        }
        getName() {
            let result = this.categoryWords[0];
            for (let i = 1; i < this.categoryWords.length; i++) {
                result += " " + this.categoryWords[i];
            }
            return result;
        }
        getChild(childName) {
            for (let child of this.children) {
                if (child.getName() == childName) {
                    return child;
                }
            }
            return null;
        }
        addCounts(termId, count) {
            let current = this;
            while (current.parent != null) {
                current.counts.putNTimes(termId, count);
                current = current.parent;
            }
        }
        isDescendant(ancestor) {
            if (this == ancestor) {
                return true;
            }
            if (this.parent == null) {
                return false;
            }
            return this.parent.isDescendant(ancestor);
        }
        getChildren() {
            return this.children;
        }
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
        setRepresentativeCount(representativeCount) {
            if (representativeCount <= this.counts.size) {
                let topList = this.counts.topN(representativeCount);
                this.counts = new CounterHashMap_1.CounterHashMap();
                for (let item of topList) {
                    this.counts.putNTimes(item[0], item[1]);
                }
            }
        }
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