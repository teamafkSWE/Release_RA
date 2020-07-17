import React, {PureComponent} from 'react';
import {Button, PanelOptionsGroup, VerticalGroup} from "@grafana/ui";
import {AppEvents, DataFrame} from "@grafana/data";
import Controller from "../../controller/controller";
import {Connection} from "../../types";


interface EditProps {
    queries: DataFrame[]
    closeEdit: () => void
    idConnection: string
    controller: Controller
    emitter: any
}


class FormEdit extends PureComponent<EditProps> {
    private readonly selectRefs: React.RefObject<HTMLSelectElement>[];
    private readonly inputNameRef: React.RefObject<HTMLInputElement>;
    private readonly connection: Connection | undefined;
    private connectionName: string;
    private readonly connectionLinks: { predictor: string, query: string }[]


    constructor(props: Readonly<EditProps>) {
        super(props);

        const connections = props.controller.getConnections()
        for (let conn of connections) {
            if (conn.id === props.idConnection)
                this.connection = conn
        }

        this.selectRefs = []
        if (this.connection != undefined) {
            for (let i = 0; i < this.connection.links.length; i++) {
                this.selectRefs.push(React.createRef())
            }
        }

        this.inputNameRef = React.createRef()

        this.connectionName = ""
        this.connectionLinks = []

        if (this.connection != undefined) {
            this.connectionName = this.connection.name
            this.connectionLinks = this.connection.links
        }

    }

    private updateName = (e: any) => {
        this.connectionName = e.target.value
    }

    private updateLinks = (e: any) => {
        const query = e.target.value
        const predictor = e.target.id

        for (let i = 0; i < this.connectionLinks.length; i++) {
            if (predictor === this.connectionLinks[i].predictor) {
                this.connectionLinks[i].query = query;
            }
        }
    }

    private updateConnection = () => {
        if (this.connectionName === "") {
            this.props.emitter.emit(AppEvents.alertWarning, ["Enter a name for the connection:"])
        } else {
            this.props.controller.editConnection(this.props.idConnection, {
                name: this.connectionName,
                list: this.connectionLinks
            })
            this.props.closeEdit();
            this.props.emitter.emit(AppEvents.alertSuccess, ["Connection changed."])
        }
    }

    componentDidMount() {
        const ref = this.inputNameRef.current
        if (ref != null && this.connection != undefined) {
            ref.value = this.connection.name


            let index = 0
            for (let predictor of this.connection.links) {
                const select = this.selectRefs[index].current
                index++;
                if (select != null) {
                    const options = select.options
                    let optionindex = 0
                    for (let i = 0; i < options.length; i++) {
                        const opt = options.item(i)
                        if (opt != null && opt.value === predictor.query)
                            optionindex = opt.index
                    }

                    select.options.selectedIndex = optionindex
                }
            }
        }

    }

    private printPredictors = () => {
        const {queries} = this.props;
        const predictors = [];

        if (this.connection != undefined) {
            let index = 0
            for (let link of this.connection.links) {
                predictors.push(
                    <div style={{display: "flex", justifyContent: "space-between", marginTop: "0.8rem"}} key={index}>
                        <label style={{alignSelf: "center"}} htmlFor={link.predictor}>{link.predictor}:</label>
                        <select ref={this.selectRefs[index]} id={link.predictor} onChange={this.updateLinks} style={{margin: "10px"}}>
                            {queries.map((query: DataFrame, index) => <option value={query.name} key={index}>{query.name}</option>)}
                        </select>
                    </div>
                )
                index++
            }
        }

        return predictors
    }

    render() {
        return (
            <>
                <PanelOptionsGroup title="Edit connection">
                    <VerticalGroup>
                        <label htmlFor={"nome_collegamento"}>Connection name:</label>
                        <input style={{width: "100%"}} ref={this.inputNameRef} type="text" placeholder="nome" id="nome_collegamento" onChange={this.updateName}/>

                        {this.printPredictors()}
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>
                            <Button onClick={this.updateConnection}>Save</Button>
                            <Button onClick={this.props.closeEdit}>Cancel</Button>
                        </div>
                    </VerticalGroup>
                </PanelOptionsGroup>
            </>
        );
    }
}

export default FormEdit;

