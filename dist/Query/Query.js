(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-dictionary/dist/Dictionary/Word"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Query = void 0;
    const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
    class Query {
        constructor(query = undefined) {
            this.terms = new Array();
            this.shortcuts = ["cc", "cm2", "cm", "gb", "ghz", "gr", "gram", "hz", "inc", "inch", "inç",
                "kg", "kw", "kva", "litre", "lt", "m2", "m3", "mah", "mb", "metre", "mg", "mhz", "ml", "mm", "mp", "ms",
                "mt", "mv", "tb", "tl", "va", "volt", "watt", "ah", "hp", "oz", "rpm", "dpi", "ppm", "ohm", "kwh", "kcal",
                "kbit", "mbit", "gbit", "bit", "byte", "mbps", "gbps", "cm3", "mm2", "mm3", "khz", "ft", "db", "sn", "g", "v", "m", "l", "w", "s"];
            if (query != undefined) {
                let terms = query.split(" ");
                for (let term of terms) {
                    this.terms.push(new Word_1.Word(term));
                }
            }
        }
        getTerm(index) {
            return this.terms[index];
        }
        size() {
            return this.terms.length;
        }
        filterAttributes(attributeList, termAttributes, phraseAttributes) {
            let i = 0;
            let filteredQuery = new Query();
            while (i < this.terms.length) {
                if (i < this.terms.length - 1) {
                    let pair = this.terms[i].getName() + " " + this.terms[i + 1].getName();
                    if (attributeList.has(pair)) {
                        phraseAttributes.terms.push(new Word_1.Word(pair));
                        i += 2;
                        continue;
                    }
                    if (this.shortcuts.includes(this.terms[i + 1].getName())) {
                        if (this.terms[i].getName().match("^[+-]?\\d+$|^[+-]?(\\d+)?\\.\\d*$")) {
                            phraseAttributes.terms.push(new Word_1.Word(pair));
                            i += 2;
                            continue;
                        }
                    }
                }
                if (attributeList.has(this.terms[i].getName())) {
                    termAttributes.terms.push(this.terms[i]);
                }
                else {
                    filteredQuery.terms.push(this.terms[i]);
                }
                i++;
            }
            return filteredQuery;
        }
    }
    exports.Query = Query;
});
//# sourceMappingURL=Query.js.map