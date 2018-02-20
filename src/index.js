import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import collectiveSearch from './collectiveSearch'

ReactDOM.render(<App searchEngine={collectiveSearch}/>, document.getElementById('root'))
registerServiceWorker()
