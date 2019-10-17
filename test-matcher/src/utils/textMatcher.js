import PinyinMatch from 'pinyin-match'

//const sampleList = require('./sampleList.json')
export const textMatcher = (resource, inputText) => {
    const textResult = []
    const position = []
    resource.forEach(element => {
        const match = PinyinMatch.match(element, String(inputText))
        if (!!match) {
            textResult.push(element)
            position.push(match)
        }
    });
    return {textResult,position}
}