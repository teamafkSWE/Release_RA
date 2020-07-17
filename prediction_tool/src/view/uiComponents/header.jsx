import React, {Component} from 'react';

class Header extends Component {
    render() {
        return (
            <React.Fragment>
            <button id="info-btn" className="btn btn-dark" onClick={this.props.setShowTrue}>Information</button>
            <div className="header mb-2">
                <h1 className="text-white text-center">Training Tool</h1>
                <h2 className="text-dark text-center"><small>Make your data useful!</small></h2>
            </div>
            </React.Fragment>
        );
    }
}

export default Header;