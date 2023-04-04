(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../Index/TermDictionary", "./Document", "./DocumentType", "../Index/NGramIndex", "../Index/CategoryTree", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AbstractCollection = void 0;
    const TermDictionary_1 = require("../Index/TermDictionary");
    const Document_1 = require("./Document");
    const DocumentType_1 = require("./DocumentType");
    const NGramIndex_1 = require("../Index/NGramIndex");
    const CategoryTree_1 = require("../Index/CategoryTree");
    const fs = require("fs");
    class AbstractCollection {
        constructor(directory, parameter) {
            this.documents = new Array();
            this.attributeList = new Set();
            this.name = directory;
            this.comparator = parameter.getWordComparator();
            this.parameter = parameter;
            if (parameter.getDocumentType() == DocumentType_1.DocumentType.CATEGORICAL) {
                this.loadAttributeList();
            }
            let files = fs.readdirSync(directory);
            files.sort();
            let fileLimit = files.length;
            if (parameter.limitNumberOfDocumentsLoaded()) {
                fileLimit = parameter.getDocumentLimit();
            }
            let i = 0;
            let j = 0;
            while (i < files.length && j < fileLimit) {
                let file = files[i];
                if (file.endsWith(".txt")) {
                    let document = new Document_1.Document(parameter.getDocumentType(), directory + "/" + file, file, j);
                    this.documents.push(document);
                    j++;
                }
                i++;
            }
            if (parameter.getDocumentType() == DocumentType_1.DocumentType.CATEGORICAL) {
                this.loadCategories();
            }
        }
        loadAttributeList() {
            let lines = fs.readFileSync(this.name + "-attributelist.txt", "utf-8").split('\n');
            for (let line of lines) {
                if (line != "") {
                    this.attributeList.add(line);
                }
            }
        }
        getLine(filesData, files, index) {
            let line = filesData[index][files[index]];
            files[index]++;
            return line;
        }
        getLines(filesData, files, index, lineCount) {
            let postingData = filesData[index].slice(files[index], files[index] + lineCount);
            files[index] += lineCount;
            return postingData;
        }
        loadCategories() {
            this.categoryTree = new CategoryTree_1.CategoryTree(this.name);
            let lines = fs.readFileSync(this.name + "-categories.txt", "utf-8").split('\n');
            for (let line of lines) {
                if (line != "") {
                    let items = line.split("\t");
                    let docId = parseInt(items[0]);
                    if (items.length > 1) {
                        this.documents[docId].setCategory(this.categoryTree, items[1]);
                    }
                }
            }
        }
        size() {
            return this.documents.length;
        }
        vocabularySize() {
            return this.dictionary.size();
        }
        constructNGramIndex() {
            let terms = this.dictionary.constructTermsFromDictionary(2);
            this.biGramDictionary = new TermDictionary_1.TermDictionary(this.comparator, terms);
            this.biGramIndex = new NGramIndex_1.NGramIndex(this.biGramDictionary, terms, this.comparator);
            terms = this.dictionary.constructTermsFromDictionary(3);
            this.triGramDictionary = new TermDictionary_1.TermDictionary(this.comparator, terms);
            this.triGramIndex = new NGramIndex_1.NGramIndex(this.triGramDictionary, terms, this.comparator);
        }
    }
    exports.AbstractCollection = AbstractCollection;
});
//# sourceMappingURL=AbstractCollection.js.map