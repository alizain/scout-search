# ScoutSearch

This is a simple search engine, and it's not very intelligent. It also probably won't find Waldo.

That being said, it was thoroughly fun to write, and should be able to go many places with proper effort.

## Test it out

To try it out for yourself, you can either:

- Download this repository and run `npm run start` or `yarn start`
- Check it out on [netlify](https://gallant-stonebraker-6b767c.netlify.com/)

## Thoughts

The key components of the system are Engines and Indexes. An engine can contain multiple indexes, which may or may not index different pieces of data in different ways. A query is usually executed against all indexes, but can be executed against one index. Each index produces a list of documents with a score of how relevant that document is to the query. The engine combines the scores to create a globally ordered list, hydrates the actual documents, and returns the results back to the user.

A key component of the system is that the Engine and Indexes are completely agnostic to the problem-domain or the structure of the dataset. Getter functions are used liberally, and everything is configurable (including the tokenizer), which is very convenient. The flexibility of the system allows us to build 3 indexes - one for searching within the text content, the second for searching for contributors, and the third for searching currencies.

Some functional things that need to be improved:
  - the algorithms are super naive at the moment, and slow - more optimization is necessary
  - the indexes don't work on partial matches
  - the indexes don't allow updates, because certain expensive computations need to be done every time a document is added, and it is easier to defer all computation till after all documents have been added.

I wrote this program relying heavily on closures as an experiment and for private variables. I'd rather write a production system in a different style, because this leads to significant code duplication.

The only external component is the stemmer, which is surprisingly slow, unfortunately.
