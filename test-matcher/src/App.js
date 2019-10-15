import React, { Component } from 'react';
import './App.css';
import { ResultList } from './ResultList/index.js';
import { textMatcher } from './utils/textMatcher';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' ,textResult : [],position:[]};
  }

  handleChange = (event) => {
    const inputText = event.target.value
    const {textResult=[],position=[]} = !!inputText ? textMatcher(inputText) : {}
    this.setState({
      value: inputText,
      textResult,
      position
    });
  }

  render() {
    return (
      <div className="App">
        <div className="test-data">
          {/* <FlavorForm /> */}
        </div>
        <div className="test-matcher">
          <p>请输入匹配字符</p>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </div>
        <div className="match-result">
          <p>匹配结果</p>
          {/* <input type="result" value={this.state.value} onChange={this.handleChange} /> */}
          <ResultList textResult={this.state.textResult} position={this.state.position}/>
        </div>
      </div>
    );
  }
}

export default App;
