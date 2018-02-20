import stemmer from 'natural/lib/natural/stemmers/lancaster_stemmer.js'
import { setWithDefault} from '../utils.js'
import stopWords from './stopWords.json'


export function SimpleTokenizer(passedOpts = {}) {

  const opts = Object.assign({}, {
    shouldFilterStop: true,
    shouldStem: true
  }, passedOpts)

  const reg = /([A-Za-z0-9-_.@#])+/g

  function getRawTokens(blob) {
    const matches = blob.match(reg)
    return (matches || [])
      .map(token => {
        if (token[token.length - 1] === '.') {
          return token.substring(0, token.length - 1)
        }
        return token
      })
  }

  function tokensWithPos(blob) {
    const results = {}
    getRawTokens(blob)
      .forEach((token, index) => {
        token = token.toLowerCase()
        if (opts.shouldFilterStop) {
          if (stopWords[token] !== undefined) {
            return
          }
        }
        if (opts.shouldStem) {
          token = stemmer.stem(token)
        }
        setWithDefault(results, token, (arr) => arr.concat([index]), [])
      })
    return results
  }

  function tokens(blob) {
    return Object.keys(tokensWithPos(blob))
  }

  return {
    tokensWithPos,
    tokens
  }

}
