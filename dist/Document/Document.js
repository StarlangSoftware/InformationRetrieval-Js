(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./DocumentText", "nlptoolkit-corpus/dist/TurkishSplitter", "nlptoolkit-corpus/dist/Corpus", "nlptoolkit-corpus/dist/Sentence", "nlptoolkit-dictionary/dist/Dictionary/Word", "./DocumentType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Document = void 0;
    const DocumentText_1 = require("./DocumentText");
    const TurkishSplitter_1 = require("nlptoolkit-corpus/dist/TurkishSplitter");
    const Corpus_1 = require("nlptoolkit-corpus/dist/Corpus");
    const Sentence_1 = require("nlptoolkit-corpus/dist/Sentence");
    const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
    const DocumentType_1 = require("./DocumentType");
    class Document {
        /**
         * Constructor for the Document class. Sets the attributes.
         * @param documentType Type of the document. Can be normal for normal documents, categorical for categorical
         *                     documents.
         * @param absoluteFileName Absolute file name of the document
         * @param fileName Relative file name of the document.
         * @param docId Id of the document
         */
        constructor(documentType, absoluteFileName, fileName, docId) {
            this.size = 0;
            this.docId = docId;
            this.absoluteFileName = absoluteFileName;
            this.fileName = fileName;
            this.documentType = documentType;
        }
        /**
         * Loads the document from input stream. For normal documents, it reads as a corpus. For categorical documents, the
         * first line contains categorical information, second line contains name of the product, third line contains
         * detailed info about the product.
         * @return Loaded document text.
         */
        loadDocument() {
            let documentText;
            switch (this.documentType) {
                case DocumentType_1.DocumentType.NORMAL:
                    documentText = new DocumentText_1.DocumentText(this.absoluteFileName, new TurkishSplitter_1.TurkishSplitter());
                    this.size = documentText.numberOfWords();
                    break;
                case DocumentType_1.DocumentType.CATEGORICAL:
                    let corpus = new Corpus_1.Corpus(this.absoluteFileName);
                    if (corpus.sentenceCount() >= 2) {
                        documentText = new DocumentText_1.DocumentText();
                        let sentences = new TurkishSplitter_1.TurkishSplitter().split(corpus.getSentence(1).toString());
                        for (let sentence of sentences) {
                            documentText.addSentence(sentence);
                        }
                        this.size = documentText.numberOfWords();
                    }
                    else {
                        return null;
                    }
                    break;
            }
            return documentText;
        }
        /**
         * Loads the category of the document and adds it to the category tree. Category information is stored in the first
         * line of the document.
         * @param categoryTree Category tree to which new product will be added.
         */
        loadCategory(categoryTree) {
            if (this.documentType == DocumentType_1.DocumentType.CATEGORICAL) {
                let corpus = new Corpus_1.Corpus(this.absoluteFileName);
                if (corpus.sentenceCount() >= 2) {
                    this.category = categoryTree.addCategoryHierarchy(corpus.getSentence(0).toString());
                }
            }
        }
        normalizeDocument(disambiguator, fsm) {
            let corpus = new Corpus_1.Corpus(this.absoluteFileName);
            for (let i = 0; i < corpus.sentenceCount(); i++) {
                let sentence = corpus.getSentence(i);
                let parses = fsm.robustMorphologicalAnalysisFromSentence(sentence);
                let correctParses = disambiguator.disambiguate(parses);
                let newSentence = new Sentence_1.Sentence();
                for (let fsmParse of correctParses) {
                    newSentence.addWord(new Word_1.Word(fsmParse.getWord().getName()));
                }
                corpus.addSentence(newSentence);
            }
            this.size = corpus.numberOfWords();
            return corpus;
        }
        /**
         * Accessor for the docId attribute.
         * @return docId attribute.
         */
        getDocId() {
            return this.docId;
        }
        /**
         * Accessor for the fileName attribute.
         * @return fileName attribute.
         */
        getFileName() {
            return this.fileName;
        }
        /**
         * Accessor for the absoluteFileName attribute.
         * @return absoluteFileName attribute.
         */
        getAbsoluteFileName() {
            return this.absoluteFileName;
        }
        /**
         * Accessor for the size attribute.
         * @return size attribute.
         */
        getSize() {
            return this.size;
        }
        /**
         * Mutator for the size attribute.
         * @param size New size attribute.
         */
        setSize(size) {
            this.size = size;
        }
        /**
         * Mutator for the category attribute.
         * @param categoryTree Category tree to which new category will be added.
         * @param category New category that will be added
         */
        setCategory(categoryTree, category) {
            this.category = categoryTree.addCategoryHierarchy(category);
        }
        /**
         * Accessor for the category attribute.
         * @return Category attribute as a String
         */
        getCategory() {
            return this.category.toString();
        }
        /**
         * Accessor for the category attribute.
         * @return Category attribute as a CategoryNode.
         */
        getCategoryNode() {
            return this.category;
        }
    }
    exports.Document = Document;
});
//# sourceMappingURL=Document.js.map