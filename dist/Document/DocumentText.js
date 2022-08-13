(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-corpus/dist/Corpus", "../Index/TermType", "../Index/TermOccurrence", "nlptoolkit-dictionary/dist/Dictionary/Word"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DocumentText = void 0;
    const Corpus_1 = require("nlptoolkit-corpus/dist/Corpus");
    const TermType_1 = require("../Index/TermType");
    const TermOccurrence_1 = require("../Index/TermOccurrence");
    const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
    class DocumentText extends Corpus_1.Corpus {
        constructor(fileName, sentenceSplitter = undefined) {
            super(fileName, sentenceSplitter);
        }
        constructDistinctWordList(termType) {
            let words = new Set();
            for (let i = 0; i < this.sentenceCount(); i++) {
                let sentence = this.getSentence(i);
                for (let j = 0; j < sentence.wordCount(); j++) {
                    switch (termType) {
                        case TermType_1.TermType.TOKEN:
                            words.add(sentence.getWord(j).getName());
                            break;
                        case TermType_1.TermType.PHRASE:
                            if (j < sentence.wordCount() - 1) {
                                words.add(sentence.getWord(j).getName() + " " + sentence.getWord(j + 1).getName());
                            }
                            break;
                    }
                }
            }
            return words;
        }
        constructTermList(docId, termType) {
            let terms = new Array();
            let size = 0;
            for (let i = 0; i < this.sentenceCount(); i++) {
                let sentence = this.getSentence(i);
                for (let j = 0; j < sentence.wordCount(); j++) {
                    switch (termType) {
                        case TermType_1.TermType.TOKEN:
                            terms.push(new TermOccurrence_1.TermOccurrence(sentence.getWord(j), docId, size));
                            size = size + 1;
                            break;
                        case TermType_1.TermType.PHRASE:
                            if (j < sentence.wordCount() - 1) {
                                terms.push(new TermOccurrence_1.TermOccurrence(new Word_1.Word(sentence.getWord(j).getName() + " " + sentence.getWord(j + 1).getName()), docId, size));
                                size = size + 1;
                            }
                            break;
                    }
                }
            }
            return terms;
        }
    }
    exports.DocumentText = DocumentText;
});
//# sourceMappingURL=DocumentText.js.map