import React, { Component } from 'react';
import { FlavorForm } from './FlavorForm/index.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <div className="test-data">
          <FlavorForm />
        </div>
        <div className="test-matcher">
          <p>请输入匹配字符</p>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </div>
        <div className="match-result">
          <p>匹配结果</p>
          <input type="result" value={this.state.value} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

export default App;
