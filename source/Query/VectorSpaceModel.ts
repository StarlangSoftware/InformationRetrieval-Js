import {TermWeighting} from "../Index/TermWeighting";
import {DocumentWeighting} from "../Document/DocumentWeighting";

export class VectorSpaceModel {

    private model: Array<number> = new Array<number>()

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

    get(index: number): number{
        return this.model[index]
    }

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