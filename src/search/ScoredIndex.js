import { setWithDefault } from '../utils'


export default function ScoredIndex(passedOpts = {}) {

  const tokenizer = passedOpts.tokenizer
  if (!tokenizer) {
    throw new Error('opts.tokenizer is required')
  }

  const opts = Object.assign({}, {
    normalize: true,
    scalingFunc: (score) => score > 0 ? 1 + Math.log(score) : 1
  }, passedOpts)

  const index = {}
  const docStats = {}
  let maxScore = 0
  let minScore = 0

  function updateMinMax(score) {
    const scoreToCompare = opts.scalingFunc(score)
    if (scoreToCompare > maxScore) {
      maxScore = scoreToCompare
    } else if (scoreToCompare < minScore) {
      minScore = scoreToCompare
    }
  }

  function normalizeScore(score) {
    return (opts.scalingFunc(score) - minScore) / (maxScore - minScore)
  }

  function addMatchesToIndex(token, docId, score) {
    if (typeof score !== 'number' || isNaN(score)) {
      score = 0
    }
    if (score < 0) {
      throw new Error('negative scores not allowed')
    }
    if (opts.normalize) {
      updateMinMax(score)
    }
    const matchObj = makeMatchObject(docId, score)
    setWithDefault(index, token, (arr) => arr.concat([matchObj]), [])
  }

  return {

    addDataForId(docId, data) {
      if (docStats[docId] !== undefined) {
        throw new Error('this index does not support updating documents yet')
      }
      docStats[docId] = true
      Object.keys(data).forEach(key => {
        const tokens = tokenizer.tokens(key)
        tokens.forEach(token => {
          addMatchesToIndex(token, docId, data[key])
        })
      })
    },

    calculateScores() {
      if (opts.normalize) {
        Object.keys(index).forEach(token => {
          const matches = index[token]
          matches.forEach(match => {
            match.score = normalizeScore(match.score)
          })
        })
      }
    },

    query(blob) {
      let resultsByDocId = {}
      tokenizer.tokens(blob).forEach(token => {
        if (index[token] !== undefined) {
          console.log(index[token])
          index[token].forEach(match => {
            setWithDefault(resultsByDocId, match.docId, (val) => val + match.score, 0)
          })
        }
      })
      return resultsByDocId
    }

  }

}


function makeMatchObject(docId, score) {
  return {
    docId,
    score,
  }
}
