import React, { Component } from 'react'


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searchQuery: '',
      searchResults: false
    }
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
  }

  handleSearchChange(ev) {
    this.setState({
      searchQuery: ev.target.value,
      searchResults: false,
    })
  }

  handleSearchSubmit(ev) {
    ev.preventDefault()
    this.setState({
      searchResults: this.props.searchEngine.query(this.state.searchQuery)
    })
  }

  renderNoResultsFound() {
    return (
      <div>No results found!</div>
    )
  }

  renderSomeResults() {
    console.log(this.state.searchResults)
    return this.state.searchResults.map(r => (
      <div key={r.id}>
        <h4>{r.name}</h4>
        <p><em>{r.longDescription}</em></p>
      </div>
    ))
  }

  renderResults() {
    if (!Array.isArray(this.state.searchResults)) {
      return []
    } else if (this.state.searchResults.length > 0) {
      return this.renderSomeResults()
    }
    return this.renderNoResultsFound()
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSearchSubmit}>
          <label>
            Query:
            <input type="text" value={this.state.searchQuery} onChange={this.handleSearchChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.renderResults()}
      </div>
    )
  }

}

export default App
