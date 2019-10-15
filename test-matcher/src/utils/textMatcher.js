import PinyinMatch from 'pinyin-match'

const sampleList = require('./sampleList.json')
export const textMatcher = (inputText) => {
    const textResult = []
    const position = []
    sampleList.forEach(element => {
        const match = PinyinMatch.match(element, String(inputText))
        if (!!match) {
            textResult.push(element)
            position.push(match)
        }
    });
    return {textResult,position}
}