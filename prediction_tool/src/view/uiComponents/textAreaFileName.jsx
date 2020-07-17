import React, {Component} from "react";

class TextAreaFileName extends Component{
    render() {
        return(<div>
                <input type="text" className="w-100 input-group-text bg-dark border-dark text-lg-left text-white" value={this.props.changeName} onChange={this.props.handleName} placeholder='Set JSON file name' />
            </div>
        );
    }
}

export default TextAreaFileName;
