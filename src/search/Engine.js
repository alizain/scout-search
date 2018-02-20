import { setWithDefault } from '../utils'


export default function Engine(rawFacetConfs) {

  const docs = {}
  const facetConfs = Object.keys(rawFacetConfs)
    .map(name => {
      const conf = rawFacetConfs[name]
      return {
        name,
        factor: typeof conf.factor === 'number' ? conf.factor : 1,
        getDataFromDoc: conf.getDataFromDoc,
        index: conf.type(conf.opts)
      }
    })

  return {

    addDoc(doc) {
      facetConfs.forEach(conf => {
        const data = conf.getDataFromDoc(doc)
        conf.index.addDataForId(doc.id, data)
      })
      docs[doc.id] = doc
    },

    calculateScores() {
      facetConfs.forEach(conf => conf.index.calculateScores())
    },

    query(blob) {
      const resultsByDocId = {}
      facetConfs.forEach(conf => {
        const facetResults = conf.index.query(blob)
        Object.keys(facetResults).forEach(docId => {
          const facetVal = facetResults[docId] * conf.factor
          setWithDefault(resultsByDocId, docId, (val) => val + facetVal, 0)
        })
      })
      return Object.entries(resultsByDocId)
        .sort((a, b) => b[1] - a[1])
        .map(a => docs[a[0]])
    }

  }

}
