import { Word } from "nlptoolkit-dictionary/dist/Dictionary/Word";
export declare class Query {
    private readonly terms;
    private shortcuts;
    /**
     * Another constructor of the Query class. Splits the query into multiple words and put them into the terms array.
     * @param query Query string
     */
    constructor(query?: string);
    /**
     * Accessor for the terms array. Returns the term at position index.
     * @param index Position of the term in the terms array.
     * @return The term at position index.
     */
    getTerm(index: number): Word;
    /**
     * Returns the size of the query, i.e. number of words in the query.
     * @return Size of the query, i.e. number of words in the query.
     */
    size(): number;
    /**
     * Filters the original query by removing phrase attributes, shortcuts and single word attributes.
     * @param attributeList Hash set containing all attributes (phrase and single word)
     * @param termAttributes New query that will accumulate single word attributes from the original query.
     * @param phraseAttributes New query that will accumulate phrase attributes from the original query.
     * @return Filtered query after removing single word and phrase attributes from the original query.
     */
    filterAttributes(attributeList: Set<string>, termAttributes: Query, phraseAttributes: Query): Query;
}
