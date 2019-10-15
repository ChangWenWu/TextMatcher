import React from 'react'

export class FlavorForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 'test1' };
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }
    render() {
        return (
            <div>
                <label>choose test data：
                        <select value={this.state.value} onChange={this.handleChange}>
                        <option value="test1">test1</option>
                        <option value="test2">test2</option>
                        <option value="test3">test3</option>
                    </select>
                </label>
            </div>
        )
    }
}