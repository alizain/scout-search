import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import collectiveSearch from './collectiveSearch'

ReactDOM.render(<App searchEngine={collectiveSearch}/>, document.getElementById('root'))
