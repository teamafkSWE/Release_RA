import React, {Component} from 'react';

class TrainButton extends Component {
    render() {
        return (
            <React.Fragment>
                    <button onClick={this.props.train} className="btn btn-dark">Start training</button>
            </React.Fragment>
        );
    }
}

export default TrainButton;