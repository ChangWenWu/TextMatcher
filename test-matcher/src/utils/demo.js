const {SimilarSearch} = require('node-nlp')
const _ =require('lodash')
const XLSX = require('xlsx')
// import {SimilarSearch} from 'node-nlp'
// import _ from 'lodash'

// const result = similar.getBestSubstring('印度股票市场投资的分步指南是什么？','在印度投资的步骤')
// console.log('result',result)

const PinyinMatch = require('pinyin-match')
 // 载入模块
 var Segment = require('segment');
 // 创建实例
 var segment = new Segment();
 // 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
 segment.useDefault();

const textMatcher = (resource, inputText) => {
    const textResult = []
    const indexResult = []
    resource.forEach((element, index) => {
        const match = PinyinMatch.match(element, String(inputText))
        if (!!match) {
            textResult.push(element)
            indexResult.push(index + 1)
        }
    });
    return {
        textResult,
        indexResult
    }
}

const similarSearch = (source=[],test) =>{
    const resultArr = []
    const similar = new SimilarSearch()
    source.forEach((item,index)=>{
        const result = similar.getBestSubstring(item, test)
        // if(result.accuracy >= 0){
            resultArr.push({index:index+1,accuracy:result.accuracy})
        // }
    })
    const output = _.orderBy(resultArr, ['accuracy'],['desc'])
    // return output.slice(0,3)
    return output
}

const readSource = () => {
    const csvFile = "./source_wps.csv";
    const workbook = XLSX.readFile(csvFile, {
        codepage: 65001
    });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    // debug(`WORKSHEET: ${util.inspect(worksheet)}`);
    const input  =  XLSX.utils.sheet_to_json(worksheet, {
        header: 1
    })
    return _.map(input,item=>String(item[1]))
    // return _.flatten(_.filter(input,item=>!_.isEmpty(item)))
};


const readTestcase = () => {
    const csvFile = "./true_testcase_wps.csv";
    const workbook = XLSX.readFile(csvFile, {
        codepage: 65001
    });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    // debug(`WORKSHEET: ${util.inspect(worksheet)}`);
    const input = XLSX.utils.sheet_to_json(worksheet, {
        header: 1
    })
    return _.flatten(input)
    // return _.flatten(_.filter(input,item=>!_.isEmpty(item)))
};

const calAccuracy = (source,testcase) =>{
    const returnVal = []
    testcase.forEach(item=>{
        const resultArr = _.map(similarSearch(source, item), item => item.index)
        returnVal.push(resultArr)
    })
    return returnVal
}

const getSliceWord = (inputText) => {
    // 开始分词
    return _.uniq(_.map(segment.doSegment(inputText, {
        stripPunctuation: true,
        convertSynonym:true,
        stripStopword:true
    }), item => item.w));
}

const calScore = (inputArr)=>{
    // [
    //     [1, 2, 3, 4],
    //     [4, 1, 2, 3],
    //     [1, 2, 3, 4],
    //     [3, 1, 2, 4]
    // ]

    // [ [ { index: 629, accuracy: 1 },
    // { index: 630, accuracy: 1 },
    // { index: 631, accuracy: 1 },
    // { index: 632, accuracy: 1 },
    // { index: 633, accuracy: 1 },

    const result = [] // [{index:1,score:2},{index:2,score:33}]
    inputArr.forEach(itemArr=>{
        itemArr.forEach((item,index)=>{
            const foundIndex = _.findIndex(result, resultItem => resultItem.index === item.index)
            if(foundIndex === -1){
                result.push({index:item.index,score:item.accuracy})
            } else {
                result[foundIndex].score += index
            }
        })
    })
    return _.map(_.orderBy(result,['score'],['asc']),item=>item.index)
}

const calPinyin = (source,testcase) =>{
    const returnVal = []
    testcase.forEach(item =>{
        // const {indexResult} = textMatcher(source,item)
        const resultSliceArr = [];
        const sliceArr = getSliceWord(item)
        // start  用pinyin 对分词进行搜索
        sliceArr.forEach(sliceItem=>{
        ////////////////////pinyin----------------------
        // console.log('sliceItem', sliceItem)
        const {textResult,indexResult} = textMatcher(source, sliceItem)
        ///////////////npl----------------------
        // const indexResult_nlp = _.map(similarSearch(source, sliceItem), item => item.index)
        //////////----------------
        
        resultSliceArr.push(_.concat(indexResult))
        })
        // end  用pinyin 对分词进行搜索
        // start 对pinyin搜索结果的数组进行：整句nlp
        let callAllArr = calAll(resultSliceArr)
        const callAllSourceText = _.map(callAllArr,index=>source[index-1])
        // const indexResult_nlp = []
        // sliceArr.forEach(sliceItem=>{
         const result = _.map(similarSearch(callAllSourceText, item), item => item.index)
        //  console.log('result',result)
        // })
        callAllArr = _.map(result, scoreItem => callAllArr[scoreItem-1])
        // end 整句nlp
        if (_.isEmpty(callAllArr)) {
            console.log('empty',item,callAllArr,resultSliceArr)
            returnVal.push([0])
        }else{
            returnVal.push(callAllArr.slice(0,3))
        }
    })
    return returnVal
    
}

const calAll =(resultArr)=>{
    // resultArr = [[1,2,3,4],[3,4,5,6],[7,8,9,0]]
    const indexArr = [] // {index:123,count:2}
    const flatResultArr = _.flatten(resultArr)
    let maxCount = 1;
    flatResultArr.forEach(arrItem => {
        const foundIndex = _.findIndex(indexArr,item => item.index === arrItem)
        if(foundIndex === -1){
            indexArr.push({index:arrItem,count:1})
            
        }else{
            indexArr[foundIndex].count +=1;
            if (indexArr[foundIndex].count >=maxCount){
                maxCount = indexArr[foundIndex].count
            }
        }
    })
    // const tmp = _.map(_.orderBy(indexArr, ['count'], ['desc']),item=>item.index)
    // const tmpFilter = _.filter(tmp,item=>item.count===maxCount)
    // console.log('tmpFilter',maxCount,tmpFilter)
    const output = _.map(_.orderBy(indexArr, ['count'], ['desc']),item=>item.index)
    return output
}

const genExcel = (data,title) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    XLSX.writeFile(wb, `${title}.csv`);
};


const source = readSource()
const testcase = readTestcase()
////// const nlp = calAccuracy(source, testcase)
const pinyin = calPinyin(source,testcase)
 ///// genExcel(nlp,'nlp')
genExcel(pinyin,'pinyin')