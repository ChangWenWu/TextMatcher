import React, { Component } from 'react';
import './App.css';
import { textMatcher } from './utils/textMatcher';
import _ from 'lodash'
import XLSX from 'xlsx'
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { source: [], keywords: [] ,textResult : [],position:[]};
  }

  selectSourceFile = (event) => {
    var selectedFile = event.target.files[0];
    var name = selectedFile.name;
    var size = selectedFile.size;
    console.log("文件名:"+name+"大小："+size);
    var reader = new FileReader();
    reader.readAsText(selectedFile);

    reader.onload = () =>{
      console.log(reader.result);
      const source = reader.result.split("\n").map((item) =>{
        return item.split(",")[1];
      });
      console.log(source);
      this.setState({
        source: _.compact(source)
      });
    };
  }

  selectKeywordsFile = (event) => {
    var selectedFile = event.target.files[0];
    var name = selectedFile.name;
    var size = selectedFile.size;
    console.log("文件名:"+name+"大小："+size);
    var reader = new FileReader();
    reader.readAsText(selectedFile);

    reader.onload = () =>{
      console.log(reader.result);
      const keywords = reader.result.split("\n");
      console.log(keywords);
      this.setState({
        keywords: _.compact(keywords)
      });
    };
  }

  exportFile = (event) => {
    const resultStr = [];

    (this.state.keywords||[]).forEach((item,index)=>{
      if(!_.isEmpty(item)){
      const {textResult,indexResult} = textMatcher(this.state.source, item)
      if (_.isEmpty(indexResult)) {
        resultStr.push([''])
      }else{
        resultStr.push(indexResult.slice(0, 3))
      }
      // console.log('result',resultStr)
      }
    });

      const ws = XLSX.utils.aoa_to_sheet(resultStr);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
      console.log('csv',wb);
      XLSX.writeFile(wb, ('SheetJSTableExport.csv'));
    //   const blob = new Blob(["\uFEFF" + resultStr], {
    //     type: 'text/csv;charset=utf-8;'
    //   })
    // const filename = "export_file.csv";
    // const link = document.createElement("a");
    // link.download = filename;//这里替换为你需要的文件名
    // link.href = URL.createObjectURL(blob);
    // link.click();
  };


  render() {
    return (
      <div className="App">
        <div className="test-file">
          <p>请选择数据源文件</p>
          <input type="file" onChange={this.selectSourceFile}/>
        </div>
        <div className="test-file">
          <p>请选择关键字文件</p>
          <input type="file" onChange={this.selectKeywordsFile}/>
        </div>
        <div className="export-button">
          <button onClick={this.exportFile}>导出</button>
        </div>
      </div>
    );
  }
}

export default App;
