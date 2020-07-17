import React, {Component} from 'react';

class DownloadJson extends Component {
    downloadJsonFile =()=> {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(this.props.jsonData));
        let name = "";
        if(this.props.changeName === "")
            name = this.props.defaultName()
        else
            name = this.props.changeName
        element.setAttribute('download', ""+ name + ".json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    render() {
        return (
            <React.Fragment>
                <button  onClick={this.downloadJsonFile} className="btn btn-dark">Download</button>
            </React.Fragment>
        );
    }
}

export default DownloadJson;