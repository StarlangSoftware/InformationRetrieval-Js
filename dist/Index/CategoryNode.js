(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-datastructure/dist/CounterHashMap", "nlptoolkit-dictionary/dist/Dictionary/Word"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CategoryNode = void 0;
    const CounterHashMap_1 = require("nlptoolkit-datastructure/dist/CounterHashMap");
    const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
    class CategoryNode {
        constructor(name, parent) {
            this.children = new Array();
            this.counts = new CounterHashMap_1.CounterHashMap();
            this.name = name;
            this.parent = parent;
            if (parent != null) {
                parent.addChild(this);
            }
        }
        addChild(child) {
            this.children.push(child);
        }
        getName() {
            return this.name;
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
        getChildren() {
            return this.children;
        }
        topN(N) {
            if (N <= this.counts.size) {
                return this.counts.topN(N);
            }
            else {
                return this.counts.topN(this.counts.size);
            }
        }
        topNString(dictionary, N) {
            let topN = this.topN(N);
            let result = this.toString();
            for (let item of topN) {
                if (!Word_1.Word.isPunctuation(dictionary.getWord(item[0]).getName())) {
                    result += "\t" + dictionary.getWord(item[0]).getName() + " (" + item[1] + ")";
                }
            }
            return result;
        }
        toString() {
            if (this.parent != null) {
                if (this.parent.parent != null) {
                    return this.parent.toString() + "%" + this.name;
                }
                else {
                    return this.name;
                }
            }
            return "";
        }
    }
    exports.CategoryNode = CategoryNode;
});
//# sourceMappingURL=CategoryNode.js.map