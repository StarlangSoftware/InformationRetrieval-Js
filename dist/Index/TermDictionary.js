(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-dictionary/dist/Dictionary/Dictionary", "fs", "./Term", "nlptoolkit-dictionary/dist/Dictionary/Word", "./TermOccurrence"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TermDictionary = void 0;
    const Dictionary_1 = require("nlptoolkit-dictionary/dist/Dictionary/Dictionary");
    const fs = require("fs");
    const Term_1 = require("./Term");
    const Word_1 = require("nlptoolkit-dictionary/dist/Dictionary/Word");
    const TermOccurrence_1 = require("./TermOccurrence");
    class TermDictionary extends Dictionary_1.Dictionary {
        constructor(comparator, fileNameOrTerms) {
            super(comparator);
            this.termComparator = (comparator) => (termA, termB) => (this.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) != 0 ?
                this.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) :
                (termA.getDocId() == termB.getDocId() ?
                    (termA.getPosition() == termB.getPosition() ?
                        0 : (termA.getPosition() < termB.getPosition() ?
                        -1 : 1)) :
                    (termA.getDocId() < termB.getDocId() ?
                        -1 : 1)));
            if (fileNameOrTerms != undefined) {
                if (typeof fileNameOrTerms === 'string') {
                    this.constructor1(fileNameOrTerms);
                }
                else {
                    if (fileNameOrTerms instanceof Array) {
                        this.constructor2(comparator, fileNameOrTerms);
                    }
                    else {
                        if (fileNameOrTerms instanceof Set) {
                            this.constructor3(comparator, fileNameOrTerms);
                        }
                    }
                }
            }
        }
        /**
         * Constructor of the TermDictionary. Reads the terms and their ids from the given dictionary file. Each line stores
         * the term id and the term name separated via space.
         * @param fileName Dictionary file name
         */
        constructor1(fileName) {
            let data = fs.readFileSync(fileName + "-dictionary.txt", 'utf8');
            let lines = data.split("\n");
            for (let line of lines) {
                if (line !== "") {
                    let termId = parseInt(line.substring(0, line.indexOf(" ")));
                    this.words.push(new Term_1.Term(line.substring(line.indexOf(" ") + 1), termId));
                }
            }
        }
        /**
         * Constructs the TermDictionary from a list of tokens (term occurrences). The terms array should be sorted
         * before calling this method. Constructs the distinct terms and their corresponding term ids.
         * @param comparator Comparator method to compare two terms.
         * @param terms Sorted list of tokens in the memory collection.
         */
        constructor2(comparator, terms) {
            let termId = 0;
            if (terms.length > 0) {
                let term = terms[0];
                this.addTerm(term.getTerm().getName(), termId);
                termId++;
                let previousTerm = term;
                let i = 1;
                while (i < terms.length) {
                    term = terms[i];
                    if (term.isDifferent(previousTerm, comparator)) {
                        this.addTerm(term.getTerm().getName(), termId);
                        termId++;
                    }
                    i++;
                    previousTerm = term;
                }
            }
        }
        /**
         * Constructs the TermDictionary from a hash set of tokens (strings). Constructs sorted dictinct terms array and
         * their corresponding term ids.
         * @param comparator Comparator method to compare two terms.
         * @param terms Hash set of tokens in the memory collection.
         */
        constructor3(comparator, terms) {
            let words = terms;
            let wordList = new Array();
            for (let word of words) {
                wordList.push(new Word_1.Word(word));
            }
            wordList.sort(this.wordComparator(this.comparator));
            let termID = 0;
            for (let term of wordList) {
                this.addTerm(term.getName(), termID);
                termID++;
            }
        }
        /**
         * Adds a new term to the sorted words array. First the term is searched in the words array using binary search,
         * then the word is added into the correct place.
         * @param name Lemma of the term
         * @param termId Id of the term
         */
        addTerm(name, termId) {
            let middle = this.binarySearch(new Word_1.Word(name));
            if (middle < 0) {
                this.words.splice(-middle - 1, 0, new Term_1.Term(name, termId));
            }
        }
        /**
         * Saves the term dictionary into the dictionary file. Each line stores the term id and the term name separated via
         * space.
         * @param fileName Dictionary file name. Real dictionary file name is created by attaching -dictionary.txt to this
         *                 file name
         */
        save(fileName) {
            let data = "";
            for (let word of this.words) {
                let term = word;
                data = data + term.getTermId() + " " + term.getName() + "\n";
            }
            fs.writeFileSync(fileName + "-dictionary.txt", data, 'utf-8');
        }
        /**
         * Constructs all NGrams from a given word. For example, 3 grams for word "term" are "$te", "ter", "erm", "rm$".
         * @param word Word for which NGrams will b created.
         * @param termId Term id to add into the posting list.
         * @param k N in NGram.
         * @return An array of NGrams for a given word.
         */
        static constructNGrams(word, termId, k) {
            let nGrams = new Array();
            if (word.length >= k - 1) {
                for (let l = -1; l < word.length - k + 2; l++) {
                    let term = "";
                    if (l == -1) {
                        term = "$" + word.substring(0, k - 1);
                    }
                    else {
                        if (l == word.length - k + 1) {
                            term = word.substring(l, l + k - 1) + "$";
                        }
                        else {
                            term = word.substring(l, l + k);
                        }
                    }
                    nGrams.push(new TermOccurrence_1.TermOccurrence(new Word_1.Word(term), termId, l));
                }
            }
            return nGrams;
        }
        /**
         * Constructs all NGrams for all words in the dictionary. For example, 3 grams for word "term" are "$te", "ter",
         * "erm", "rm$".
         * @param k N in NGram.
         * @return A sorted array of NGrams for all words in the dictionary.
         */
        constructTermsFromDictionary(k) {
            let terms = new Array();
            for (let i = 0; i < this.size(); i++) {
                let word = this.getWord(i).getName();
                terms = terms.concat(TermDictionary.constructNGrams(word, i, k));
            }
            terms.sort(this.termComparator(this.comparator));
            return terms;
        }
    }
    exports.TermDictionary = TermDictionary;
});
//# sourceMappingURL=TermDictionary.js.map