Information Retrieval
============

Video Lectures
============

[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video1.jpg width="50%">](https://youtu.be/DhjZPVrvdnE)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video2.jpg width="50%">](https://youtu.be/rfNoyFw-_g8)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video3.jpg width="50%">](https://youtu.be/sYHVpTZL6o4)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video4.jpg width="50%">](https://youtu.be/bRckCK9VcKQ)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video5.jpg width="50%">](https://youtu.be/ZX4zTT69ll0)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video6.jpg width="50%">](https://youtu.be/AVoLka-LDXY)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video7.jpg width="50%">](https://youtu.be/5GOyBTeSJwo)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video8.jpg width="50%">](https://youtu.be/-iu6N8KZslw)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video9.jpg width="50%">](https://youtu.be/LwQYHFyDd8U)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video10.jpg width="50%">](https://youtu.be/Y_jS03r6GMI)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video11.jpg width="50%">](https://youtu.be/msRT2yx0yms)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video12.jpg width="50%">](https://youtu.be/B5RProYhMvk)[<img src=https://github.com/StarlangSoftware/InformationRetrieval/blob/master/video13.jpg width="50%">](https://youtu.be/dxc3ONoW63E)

For Developers
============

You can also see [Python](https://github.com/starlangsoftware/InformationRetrieval-Py), [Cython](https://github.com/starlangsoftware/InformationRetrieval-Cy), [C++](https://github.com/starlangsoftware/InformationRetrieval-CPP), [C](https://github.com/starlangsoftware/InformationRetrieval-C), [Java](https://github.com/starlangsoftware/InformationRetrieval), [Php](https://github.com/starlangsoftware/InformationRetrieval-Php), or [C#](https://github.com/starlangsoftware/InformationRetrieval-CS) repository.

For Contibutors
============

### package.json file

1. main and types are important when this package will be imported.
```
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
```
2. Dependencies should be maximum (not only direct but also indirect references should also be given), everything directly in the code should be given here.
```
  "dependencies": {
    "nlptoolkit-corpus": "^1.0.12",
    "nlptoolkit-dictionary": "^1.0.14",
    "nlptoolkit-morphologicalanalysis": "^1.0.19",
    "nlptoolkit-xmlparser": "^1.0.7"
  }
```

### tsconfig.json file

1. Compiler flags currently includes nodeNext for importing.
```
  "compilerOptions": {
    "outDir": "dist",
    "module": "nodeNext",
    "sourceMap": true,
    "noImplicitAny": true,
    "removeComments": false,
    "declaration": true,
  },
```
2. tests, node_modules and dist should be excluded.
```
  "exclude": [
    "tests",
    "node_modules",
    "dist"
  ]
```

### index.ts file

1. Should include all ts classes.
```
export * from "./CategoryType"
export * from "./InterlingualDependencyType"
export * from "./InterlingualRelation"
export * from "./Literal"
```

### Data files
1. Add data files to the project folder. Subprojects should include all data files of the parent projects.

### Javascript files

1. Classes should be defined as exported.
```
export class JCN extends ICSimilarity{
```
2. Do not forget to comment each function.
```
    /**
     * Computes JCN wordnet similarity metric between two synsets.
     * @param synSet1 First synset
     * @param synSet2 Second synset
     * @return JCN wordnet similarity metric between two synsets
     */
    computeSimilarity(synSet1: SynSet, synSet2: SynSet): number {
```
3. Function names should follow caml case.
```
    setSynSetId(synSetId: string){
```
4. Write getter and setter methods.
```
    getRelation(index: number): Relation{
    setName(name: string){
```
5. Use standard javascript test style.
```
describe('SimilarityPathTest', function() {
    describe('SimilarityPathTest', function() {
        it('testComputeSimilarity', function() {
            let turkish = new WordNet();
            let similarityPath = new SimilarityPath(turkish);
            assert.strictEqual(32.0, similarityPath.computeSimilarity(turkish.getSynSetWithId("TUR10-0656390"), turkish.getSynSetWithId("TUR10-0600460")));
            assert.strictEqual(13.0, similarityPath.computeSimilarity(turkish.getSynSetWithId("TUR10-0412120"), turkish.getSynSetWithId("TUR10-0755370")));
            assert.strictEqual(13.0, similarityPath.computeSimilarity(turkish.getSynSetWithId("TUR10-0195110"), turkish.getSynSetWithId("TUR10-0822980")));
        });
    });
});
```
6. Enumerated types should be declared with enum.
```
export enum CategoryType {
    MATHEMATICS, SPORT, MUSIC, SLANG, BOTANIC,
    PLURAL, MARINE, HISTORY, THEOLOGY, ZOOLOGY,
    METAPHOR, PSYCHOLOGY, ASTRONOMY, GEOGRAPHY, GRAMMAR,
    MILITARY, PHYSICS, PHILOSOPHY, MEDICAL, THEATER,
    ECONOMY, LAW, ANATOMY, GEOMETRY, BUSINESS,
    PEDAGOGY, TECHNOLOGY, LOGIC, LITERATURE, CINEMA,
    TELEVISION, ARCHITECTURE, TECHNICAL, SOCIOLOGY, BIOLOGY,
    CHEMISTRY, GEOLOGY, INFORMATICS, PHYSIOLOGY, METEOROLOGY,
    MINERALOGY
}
```
7. If there are multiple constructors for a class, define them as constructor1, constructor2, ..., then from the original constructor call these methods.
```
    constructor1(symbol: any){
    constructor2(symbol: any, multipleFile: MultipleFile) {
    constructor(symbol: any, multipleFile: MultipleFile = undefined) {
        if (multipleFile == undefined){
            this.constructor1(symbol);
        } else {
            this.constructor2(symbol, multipleFile);
        }
    }
```
8. Importing should be done via import method with referencing the node-modules.
```
import {Corpus} from "nlptoolkit-corpus/dist/Corpus";
import {Sentence} from "nlptoolkit-corpus/dist/Sentence";
```
9. Use xmlparser package for parsing xml files.
```
	var doc = new XmlDocument("test.xml")
	doc.parse()
	let root = doc.getFirstChild()
	let firstChild = root.getFirstChild()
```
