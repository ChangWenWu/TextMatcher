import {
    textMatcher
} from './textMatcher'

it('test', () => {
    const { textResult} = textMatcher('react')
    const expected = ["react的", "时候就想过React的", "react有什么关系", "reaction（反应）的", "所以叫react", "react让我知道了", "他只是让我能够使用那些react已知的功能", "hooks是react一种更直接的表达方式", "现在你看一下react的logo"]

    expect(textResult).toEqual(expected)
})

it('test', () => {
    const { textResult} = textMatcher(12)

    expect(textResult).toEqual([])
})