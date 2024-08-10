import {TermWeighting} from "../Index/TermWeighting";
import {DocumentWeighting} from "../Document/DocumentWeighting";

export class VectorSpaceModel {

    private model: Array<number> = new Array<number>()

    /**
     * Constructor for the VectorSpaceModel class. Calculates the normalized tf-idf vector of a single document.
     * @param termFrequencies Term frequencies in the document
     * @param documentFrequencies Document frequencies of terms.
     * @param documentSize Number of documents in the collection
     * @param termWeighting Term weighting scheme applied in term frequency calculation.
     * @param documentWeighting Document weighting scheme applied in document frequency calculation.
     */
    constructor(termFrequencies: Array<number>,
                documentFrequencies: Array<number>,
                documentSize: number,
                termWeighting: TermWeighting,
                documentWeighting: DocumentWeighting) {
        let sum = 0
        for (let i = 0; i < termFrequencies.length; i++){
            this.model.push(VectorSpaceModel.weighting(termFrequencies[i],
                documentFrequencies[i],
                documentSize,
                termWeighting,
                documentWeighting))
            sum += this.model[i] * this.model[i]
        }
        for (let i = 0; i < termFrequencies.length; i++){
            this.model[i] /= Math.sqrt(sum)
        }
    }

    /**
     * Returns the tf-idf value for a column at position index
     * @param index Position of the column
     * @return tf-idf value for a column at position index
     */
    get(index: number): number{
        return this.model[index]
    }

    /**
     * Calculates the cosine similarity between this document vector and the given second document vector.
     * @param secondModel Document vector of the second document.
     * @return Cosine similarity between this document vector and the given second document vector.
     */
    cosineSimilarity(secondModel: VectorSpaceModel): number{
        let sum = 0.0
        if (this.model.length != secondModel.model.length){
            return 0.0
        } else {
            for (let i = 0; i < this.model.length; i++){
                sum += this.model[i] * secondModel.model[i]
            }
        }
        return sum
    }

    /**
     * Calculates tf-idf value of a single word (column) of the document vector.
     * @param termFrequency Term frequency of this word in the document
     * @param documentFrequency Document frequency of this word.
     * @param documentSize Number of documents in the collection
     * @param termWeighting Term weighting scheme applied in term frequency calculation.
     * @param documentWeighting Document weighting scheme applied in document frequency calculation.
     * @return tf-idf value of a single word (column) of the document vector.
     */
    static weighting(termFrequency: number,
              documentFrequency: number,
              documentSize: number,
              termWeighting: TermWeighting,
              documentWeighting: DocumentWeighting): number{
        let multiplier1 = 1.0, multiplier2 = 1.0
        switch (termWeighting){
            case   TermWeighting.NATURAL:
                multiplier1 = termFrequency
                break;
            case TermWeighting.LOGARITHM:
                if (termFrequency > 0)
                    multiplier1 = 1.0 + Math.log(termFrequency)
                else
                    multiplier1 = 0.0
                break;
            case TermWeighting.BOOLE:
                if (termFrequency > 0){
                    multiplier1 = 1.0
                } else {
                    multiplier1 = 0.0
                }
        }
        switch (documentWeighting){
            case DocumentWeighting.NO_IDF:
                multiplier2 = 1.0
                break;
            case DocumentWeighting.IDF:
                multiplier2 = Math.log(documentSize / documentFrequency)
                break;
            case DocumentWeighting.PROBABILISTIC_IDF:
                if (documentSize > 2 * documentFrequency){
                    multiplier2 = Math.log((documentSize - documentFrequency) / documentFrequency)
                } else {
                    multiplier2 = 0.0
                }
                break;
        }
        return multiplier1 * multiplier2
    }
}