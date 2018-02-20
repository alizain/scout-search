import { setWithDefault } from '../utils'


export default function TermFrequencyIndex(passedOpts = {}) {

  const tokenizer = passedOpts.tokenizer
  if (!tokenizer) {
    throw new Error('opts.tokenizer is required')
  }

  const index = {}
  const docStats = {}

  function addMatchesToIndex(token, docId, pos) {
    const matchObj = makeMatchObject(docId, pos)
    setWithDefault(index, token, (arr) => arr.concat([matchObj]), [])
  }

  return {

    addDataForId(docId, blob) {
      if (docStats[docId] !== undefined) {
        throw new Error('this index does not support updating documents yet')
      }
      let totalTerms = 0
      const tokensWithPos = tokenizer.tokensWithPos(blob)
      Object.keys(tokensWithPos).forEach(token => {
        totalTerms += tokensWithPos[token].length
        addMatchesToIndex(token, docId, tokensWithPos[token])
      })
      docStats[docId] = {
        totalTerms
      }
    },

    calculateScores() {
      const totalDocs = Object.keys(docStats).length
      Object.keys(index).forEach(token => {
        const matches = index[token]
        const idf = Math.log(1 + (totalDocs / matches.length))
        matches.forEach(match => {
          const td = 1 + Math.log(match.pos.length)
          match.score = idf * td
        })
      })
    },

    query(blob) {
      let resultsByDocId = {}
      tokenizer.tokens(blob).forEach(token => {
        if (index[token] !== undefined) {
          index[token].forEach(match => {
            setWithDefault(resultsByDocId, match.docId, (val) => val + match.score, 0)
          })
        }
      })
      return resultsByDocId
    }

  }

}


function makeMatchObject(docId, pos) {
  return {
    docId,
    pos,
    score: 0,
  }
}
