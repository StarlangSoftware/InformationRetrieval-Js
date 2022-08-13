import { TermWeighting } from "../Index/TermWeighting";
import { DocumentWeighting } from "../Document/DocumentWeighting";
export declare class VectorSpaceModel {
    private model;
    constructor(termFrequencies: Array<number>, documentFrequencies: Array<number>, documentSize: number, termWeighting: TermWeighting, documentWeighting: DocumentWeighting);
    get(index: number): number;
    cosineSimilarity(secondModel: VectorSpaceModel): number;
    static weighting(termFrequency: number, documentFrequency: number, documentSize: number, termWeighting: TermWeighting, documentWeighting: DocumentWeighting): number;
}
