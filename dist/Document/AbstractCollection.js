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
        /**
         * Constructor for the AbstractCollection class. All collections, disk, memory, large, medium are extended from this
         * basic class. Loads the attribute list from attribute file if required. Loads the names of the documents from
         * the document collection. If the collection is a categorical collection, also loads the category tree.
         * @param directory Directory where the document collection resides.
         * @param parameter Search parameter
         */
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
        /**
         * Loads the attribute list from attribute index file. Attributes are single or bi-word phrases representing the
         * important features of products in the collection. Each line of the attribute file contains either single or a two
         * word expression.
         */
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
        /**
         * Loads the category tree for the categorical collections from category index file. Each line of the category index
         * file stores the index of the category and the category name with its hierarchy. Hierarchy string is obtained by
         * concatenating the names of all nodes in the path from root node to a leaf node separated with '%'.
         */
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
        /**
         * Returns size of the document collection.
         * @return Size of the document collection.
         */
        size() {
            return this.documents.length;
        }
        /**
         * Returns size of the term dictionary.
         * @return Size of the term dictionary.
         */
        vocabularySize() {
            return this.dictionary.size();
        }
        /**
         * Constructs bi-gram and tri-gram indexes in memory.
         */
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