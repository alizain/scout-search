import Engine from './search/Engine'
import TermFrequencyIndex from './search/TermFrequencyIndex'
import ScoredIndex from './search/ScoredIndex'
import { SimpleTokenizer } from './search/tokenizers'
import collectives from './data/collectives.json'

const fullTextTokenizer = SimpleTokenizer()
const keywordTokenizer = SimpleTokenizer({ shouldFilterStop: false, shouldStem: false })

const facetConfigs = {
  fulltext: {
    type: TermFrequencyIndex,
    opts: {
      tokenizer: fullTextTokenizer
    },
    getDataFromDoc(doc) {
      return ['name', 'description', 'longDescription', 'mission']
        .map(key => doc[key] || '')
        .join(' ')
    }
  },
  contributors: {
    type: ScoredIndex,
    factor: 3,
    opts: {
      tokenizer: keywordTokenizer
    },
    getDataFromDoc(doc) {
      try {
        return doc.data.githubContributors || {}
      } catch (e) {
        return {}
      }
    }
  },
  currency: {
    type: ScoredIndex,
    factor: 1.5,
    opts: {
      tokenizer: keywordTokenizer,
      normalize: false
    },
    getDataFromDoc(doc) {
      return {
        [doc.currency]: 1
      }
    }
  },
}

const engine = Engine(facetConfigs)

collectives.map(doc => engine.addDoc(doc))
engine.calculateScores()

export default engine
