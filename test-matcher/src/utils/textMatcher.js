import PinyinMatch from 'pinyin-match'

export const textMatcher = (resource, inputText) => {
    const textResult = []
    const indexResult = []
    resource.forEach((element,index) => {
        const match = PinyinMatch.match(element, String(inputText))
        if (!!match) {
            textResult.push(element)
            indexResult.push(index)
        }
    });
    return {
        textResult,
        indexResult
    }
}