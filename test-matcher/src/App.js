import React, { Component } from 'react';
import './App.css';
import { ResultList } from './ResultList/index.js';
import { textMatcher } from './utils/textMatcher';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { resource: [], value: '' ,textResult : [],position:[]};
  }

  handleChange = (event) => {
    const inputText = event.target.value;
    const {textResult=[],position=[]} = !!inputText ? textMatcher(this.state.resource, inputText) : {};
    this.setState({
      value: inputText,
      textResult,
      position
    });
  }

  selectFile = (event) => {
    var selectedFile = event.target.files[0];
    var name = selectedFile.name;
    var size = selectedFile.size;
    console.log("文件名:"+name+"大小："+size);
    var reader = new FileReader();
    reader.readAsText(selectedFile);

    reader.onload = () =>{
      const strArray = reader.result.split("\n");
      console.log(strArray);
      this.setState({
        resource: strArray,
      });
    };
  }

  render() {
    return (
      <div className="App">
        <div className="test-file">
          <p>请选择文件</p>
          <input type="file" onChange={this.selectFile}/>
        </div>
        <div className="test-matcher">
          <p>请输入匹配字符</p>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </div>
        <div className="match-result">
          <p>匹配结果</p>
          <ResultList textResult={this.state.textResult} position={this.state.position}/>
        </div>
      </div>
    );
  }
}

export default App;
