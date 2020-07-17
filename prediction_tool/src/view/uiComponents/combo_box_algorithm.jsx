import React, {Component} from 'react';

class ComboBoxAlgorithm extends Component {
    render() {
        return (
            <React.Fragment>
                <select id="algo" className="btn btn-dark" onChange={this.props.changeAlgorithm} value={this.props.algorithm}>
                    <option value="">Select the algorithm:</option>
                    <option value="svm">Support Vector Machine</option>
                    <option value="rl">Linear Regression</option>
                </select>
            </React.Fragment>
        );
    }
}

export default ComboBoxAlgorithm;