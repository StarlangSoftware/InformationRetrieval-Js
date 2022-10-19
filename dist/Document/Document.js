(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./DocumentText", "nlptoolkit-corpus/dist/TurkishSplitter", "nlptoolkit-corpus/dist/Corpus", "nlptoolkit-corpus/dist/Sentence", "nlptoolkit-dictionary/dist/Dictionary/Word", "./DocumentType", "./CategoryHierarchy"], factory);
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
    const CategoryHierarchy_1 = require("./CategoryHierarchy");
    class Document {
        constructor(documentType, absoluteFileName, fileName, docId) {
            this.size = 0;
            this.docId = docId;
            this.absoluteFileName = absoluteFileName;
            this.fileName = fileName;
            this.documentType = documentType;
        }
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
                        this.categoryHierarchy = new CategoryHierarchy_1.CategoryHierarchy(corpus.getSentence(0).toString());
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
        getDocId() {
            return this.docId;
        }
        getFileName() {
            return this.fileName;
        }
        getAbsoluteFileName() {
            return this.absoluteFileName;
        }
        getSize() {
            return this.size;
        }
        setSize(size) {
            this.size = size;
        }
        setCategoryHierarchy(categoryHierarchy) {
            this.categoryHierarchy = new CategoryHierarchy_1.CategoryHierarchy(categoryHierarchy);
        }
        getCategoryHierarchy() {
            return this.categoryHierarchy;
        }
    }
    exports.Document = Document;
});
//# sourceMappingURL=Document.js.map