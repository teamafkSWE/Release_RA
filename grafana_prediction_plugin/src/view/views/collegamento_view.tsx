import React, {PureComponent} from 'react';
import {Button, PanelOptionsGrid, PanelOptionsGroup, VerticalGroup} from "@grafana/ui";
import {AppEvents, DataFrame} from "@grafana/data";

import Controller from "../../controller/controller";


interface MyProps {
    controller: Controller
    queries: DataFrame[]
    emitter: any
}


class CollegamentoView extends PureComponent<MyProps> {
    private readonly selectRefs: React.RefObject<HTMLSelectElement>[];
    private readonly inputNameRef: React.RefObject<HTMLInputElement>;
    private connectionName: string;
    private connectionLinks: { predictor: string, query: string | null }[]

    constructor(props: Readonly<MyProps>) {
        super(props);
        const predictors = this.props.controller.getPredictors()

        this.selectRefs = new Array(predictors.length)
        for (let i = 0; i < this.selectRefs.length; i++) {
            this.selectRefs[i] = React.createRef()
        }
        this.inputNameRef = React.createRef()

        this.connectionName = ""
        this.connectionLinks = []

        this.resetList()
    }

    private resetList = () => {
        const links = []
        const predictors = this.props.controller.getPredictors();

        for (let predictor of predictors) {
            links.push({predictor: predictor.name, query: null})
        }

        this.connectionLinks = links
    }


    private setName = (e: any) => {
        this.connectionName = e.target.value
    }

    private addLink = (e: any) => {
        const predictorName = e.target.id;
        const queryName = e.target.value;

        for (let i = 0; i < this.connectionLinks.length; i++) {
            if (predictorName === this.connectionLinks[i].predictor) {
                this.connectionLinks[i].query = queryName;
            }
        }
    }

    private setupConnection = () => {
        if (this.connectionName === "") {
            this.props.emitter.emit(AppEvents.alertWarning, ["Enter a name for the connection:"])
        }

        //constrollo che siano stati collegati tutti i predittori
        else {
            let allPredictorLinked = true;

            for (let link of this.connectionLinks) {
                if (link.query === null)
                    allPredictorLinked = false
            }

            if (allPredictorLinked) {
                this.props.controller.addConnection({
                    name: this.connectionName,
                    links: (this.connectionLinks as { predictor: string, query: string }[])
                })
                this.props.emitter.emit(AppEvents.alertSuccess, ["Connection inserted."])
                this.resetList()
                //resetto il nome del collegamento
                const ref = this.inputNameRef.current
                if (ref != null)
                    ref.value = ""
                //resetto le select
                for (let i = 0; i < this.selectRefs.length; i++) {
                    const ref = this.selectRefs[i].current
                    if (ref != null) {
                        ref.options.selectedIndex = 0
                    }
                }
            } else
                this.props.emitter.emit(AppEvents.alertWarning, ["You must connect all the predictors."])
        }
    }

    private printPredictors = () => {
        const file = this.props.controller.getFile();
        const {queries} = this.props;

        if (file === undefined) //non è stato inserito il file json
            return (<p>No JSON file found. Please, insert a compatible one to start.</p>)
        else if (queries.length <= 0) //non sono state impostate delle query
            return (<p>No query set. Please, set one (or more) to continue.</p>)
        else { //è presente un file json compatibile e sono presenti delle query
            const predictors = this.props.controller.getPredictors();
            return (
                <>
                    <p style={{fontStyle: "italic"}}>
                        Watch out: you must connect all the predictors!
                    </p>
                    <div style={{borderLeft: "white 1px solid", paddingLeft: "1rem"}}>
                        <label htmlFor={"nome_collegamento"} style={{display: "block"}}>Connection name:</label>
                        <input type="text" placeholder="nome" id="nome_collegamento"
                               onChange={this.setName} style={{width: "100%", border: "1px solid #262628"}} ref={this.inputNameRef}/>
                        {predictors.map((predictor, index) => //per ogni predittore mostro una selezione tra tutte le query
                            <div style={{display: "flex", justifyContent: "space-between", marginTop: "0.8rem"}}>
                                <label style={{alignSelf: "center"}} htmlFor={predictor.name}>{predictor.name}:</label>
                                <select ref={this.selectRefs[index]} id={predictor.name} onChange={this.addLink} style={{marginLeft: "0.8rem"}}>
                                    <option value={" "}>Select the node:</option>
                                    {queries.map((query: DataFrame) =>
                                        <option value={query.name}>{query.name}</option>)
                                    }
                                </select>
                            </div>
                        )}
                    </div>
                    <Button style={{marginTop: "1rem"}} onClick={this.setupConnection}>Add connection</Button>
                </>
            );
        }
    }

    render() {
        if (!this.props.controller.isMonitoring())
            return (
                <PanelOptionsGrid>
                    <PanelOptionsGroup title="Insert connection">
                        <VerticalGroup>
                            {this.printPredictors()}
                        </VerticalGroup>
                    </PanelOptionsGroup>
                </PanelOptionsGrid>
            );
        else return (<p>You can't modify something while monitoring.</p>)
    }

}

export default CollegamentoView;