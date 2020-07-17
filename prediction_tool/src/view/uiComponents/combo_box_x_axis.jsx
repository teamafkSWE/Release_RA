import React, {Component} from 'react';

class ComboBoxAxisX extends Component {
    render() {
        return (
            <React.Fragment>
                <p>Select the coefficient to be displayed in the X axis: </p>
                <select id="xAxis" className="btn btn-dark" onChange={this.props.changeXAxis} value={this.props.xAxis}>
                    {this.props.viewModel.getPredictorsName().map((a) =>
                        <option key={a} value={a}>{a}</option>)
                    }
                </select>
            </React.Fragment>
        );
    }
}
export default ComboBoxAxisX;