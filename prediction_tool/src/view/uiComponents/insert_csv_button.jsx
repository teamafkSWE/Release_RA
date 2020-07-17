import React, {Component} from 'react';
import CSVReader from "react-csv-reader";

class InsertCsvButton extends Component {
    render() {
        return (
            <React.Fragment>
                <label className="btn btn-dark" htmlFor="1">Select file</label>
                <CSVReader
                    accept={".csv"}
                    inputId="1"
                    cssClass="d-none"
                    onFileLoaded={this.props.handleForce}
                />
            </React.Fragment>
        );
    }
}

export default InsertCsvButton;