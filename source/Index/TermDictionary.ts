import {Dictionary} from "nlptoolkit-dictionary/dist/Dictionary/Dictionary";
import {WordComparator} from "nlptoolkit-dictionary/dist/Dictionary/WordComparator";
import * as fs from "fs";
import {Term} from "./Term";
import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";
import {TermOccurrence} from "./TermOccurrence";

export class TermDictionary extends Dictionary{

    constructor(comparator: WordComparator, fileNameOrTerms?: any) {
        super(comparator);
        if (fileNameOrTerms != undefined){
            if (fileNameOrTerms instanceof String){
                let data = fs.readFileSync(fileNameOrTerms + "-dictionary.txt", 'utf8')
                let lines = data.split("\n")
                for (let line of lines){
                    let termId = parseInt(line.substring(0, line.indexOf(" ")))
                    this.words.push(new Term(line.substring(line.indexOf(" ") + 1), termId))
                }
            } else {
                if (fileNameOrTerms instanceof Array){
                    let terms = fileNameOrTerms
                    let termId = 0;
                    if (terms.length > 0){
                        let term = terms[0]
                        this.addTerm(term.getTerm().getName(), termId)
                        termId++
                        let previousTerm = term
                        let i = 1
                        while (i < terms.length){
                            term = terms[i]
                            if (term.isDifferent(previousTerm, comparator)){
                                this.addTerm(term.getTerm().getName(), termId)
                                termId++
                            }
                            i++
                            previousTerm = term
                        }
                    }
                } else {
                    if (fileNameOrTerms instanceof Set){
                        let words = fileNameOrTerms
                        let wordList = new Array<Word>()
                        for (let word of words){
                            wordList.push(new Word(word))
                        }
                        wordList.sort(this.wordComparator(this.comparator))
                        let termID = 0
                        for (let term of wordList){
                            this.addTerm(term.getName(), termID)
                            termID++
                        }
                    }
                }
            }
        }
    }

    addTerm(name: string, termId: number){
        let middle = this.binarySearch(new Word(name))
        if (middle < 0){
            this.words.splice(-middle -1, 0, new Term(name, termId))
        }
    }

    save(fileName: string){
        let data = ""
        for (let word of this.words){
            let term = <Term> word
            data = data + term.getTermId() + " " + term.getName() + "\n"
        }
        fs.writeFileSync(fileName + "-dictionary.txt", data, 'utf-8')
    }

    static constructNGrams(word: string, termId: number, k: number): Array<TermOccurrence>{
        let nGrams = new Array<TermOccurrence>()
        if (word.length >= k - 1){
            for (let l = -1; l < word.length - k + 2; l++){
                let term = ""
                if (l == -1){
                    term = "$" + word.substring(0, k - 1)
                } else {
                    if (l == word.length - k + 1){
                        term = word.substring(l, l + k - 1) + "$"
                    } else {
                        term = word.substring(l, l + k)
                    }
                }
                nGrams.push(new TermOccurrence(new Word(term), termId, l))
            }
        }
        return nGrams
    }

    termComparator = (comparator: WordComparator) =>
        (termA: TermOccurrence, termB: TermOccurrence) => (this.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) != 0 ?
                this.wordComparator(comparator)(termA.getTerm(), termB.getTerm()) :
                (termA.getDocId() == termB.getDocId() ?
                    (termA.getPosition() == termB.getPosition() ?
                        0 : (termA.getPosition() < termB.getPosition() ?
                            -1 : 1)) :
                    (termA.getDocId() < termB.getDocId() ?
                        -1 : 1))
        )

    constructTermsFromDictionary(k: number): Array<TermOccurrence>{
        let terms = new Array<TermOccurrence>()
        for (let i = 0; i < this.size(); i++){
            let word = this.getWord(i).getName()
            terms.concat(TermDictionary.constructNGrams(word, i, k))
        }
        terms.sort(this.termComparator(this.comparator))
        return terms;
    }
}