import React, {PureComponent} from 'react';
import {PanelOptionsGrid, PanelOptionsGroup, VerticalGroup} from "@grafana/ui";
import Files from "react-files";
import Observer from "../observer/observer";
import Controller from "../../controller/controller";
import {AppEvents} from "@grafana/data";

interface Props {
    emitter: any
    controller: Controller
}

interface State {
    file: File | undefined
    filename: string
    jsonContent: string
}

class CaricamentoJsonView extends PureComponent<Props, State> implements Observer {

    constructor(props: Readonly<Props>) {
        super(props);
        props.controller.attach(this)
        const json = this.props.controller.getJson()
        const file = this.props.controller.getFile()
        const filename = file === undefined ? '' : file.name
        this.state = {
            file: file,
            filename: filename,
            jsonContent: JSON.stringify(json, null, 2)
        }
    }

    componentWillUnmount() {
        this.props.controller.detach(this)
    }

    update = (): void => { //invocata dal controller nel momento in cui viene letto il file json
        const file = this.props.controller.getFile()

        if (file === this.state.file)
            this.props.emitter.emit(AppEvents.alertWarning, ["File JSON not supported", "The file you selected is not compatible with the plugin"])
        else {
            const json = this.props.controller.getJson()
            const filename = file === undefined ? '' : file.name
            this.props.emitter.emit(AppEvents.alertSuccess, ["File JSON loaded successfully"])
            this.setState({jsonContent: JSON.stringify(json, null, 2), filename: filename, file: file})
        }
    }

    fileUpload = (files: File[]) => {
        if (this.state.file === undefined || confirm("There is already a json file. Do you want to change it?"))
            this.props.controller.setJson(files[files.length - 1])
    }

    render() {
        if (!this.props.controller.isMonitoring())
            return (
                <PanelOptionsGrid>
                    <PanelOptionsGroup title="Upload the File">
                        <VerticalGroup>
                            <Files
                                className="files-dropzone"
                                onChange={this.fileUpload}
                                onError={(err: any) => console.log(err)}
                                accepts={[".json"]}
                                maxFileSize={10000000}
                                minFileSize={0}
                                clickable
                            >
                                <p>Drop files here or click to upload</p>
                                <p>File: {this.state.filename}</p>
                            </Files>
                        </VerticalGroup>
                    </PanelOptionsGroup>
                    <PanelOptionsGroup title="File contents">
                        <pre id='textarea'>{this.state.jsonContent}</pre>
                    </PanelOptionsGroup>
                </PanelOptionsGrid>
            );
        else return (<p>You can't modify something while monitoring.</p>)
    }

}

export default CaricamentoJsonView;
