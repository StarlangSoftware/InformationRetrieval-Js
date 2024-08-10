import { TermWeighting } from "../Index/TermWeighting";
import { DocumentWeighting } from "../Document/DocumentWeighting";
export declare class VectorSpaceModel {
    private model;
    /**
     * Constructor for the VectorSpaceModel class. Calculates the normalized tf-idf vector of a single document.
     * @param termFrequencies Term frequencies in the document
     * @param documentFrequencies Document frequencies of terms.
     * @param documentSize Number of documents in the collection
     * @param termWeighting Term weighting scheme applied in term frequency calculation.
     * @param documentWeighting Document weighting scheme applied in document frequency calculation.
     */
    constructor(termFrequencies: Array<number>, documentFrequencies: Array<number>, documentSize: number, termWeighting: TermWeighting, documentWeighting: DocumentWeighting);
    /**
     * Returns the tf-idf value for a column at position index
     * @param index Position of the column
     * @return tf-idf value for a column at position index
     */
    get(index: number): number;
    /**
     * Calculates the cosine similarity between this document vector and the given second document vector.
     * @param secondModel Document vector of the second document.
     * @return Cosine similarity between this document vector and the given second document vector.
     */
    cosineSimilarity(secondModel: VectorSpaceModel): number;
    /**
     * Calculates tf-idf value of a single word (column) of the document vector.
     * @param termFrequency Term frequency of this word in the document
     * @param documentFrequency Document frequency of this word.
     * @param documentSize Number of documents in the collection
     * @param termWeighting Term weighting scheme applied in term frequency calculation.
     * @param documentWeighting Document weighting scheme applied in document frequency calculation.
     * @return tf-idf value of a single word (column) of the document vector.
     */
    static weighting(termFrequency: number, documentFrequency: number, documentSize: number, termWeighting: TermWeighting, documentWeighting: DocumentWeighting): number;
}
