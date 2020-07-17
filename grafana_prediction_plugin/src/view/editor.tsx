import React, {PureComponent} from 'react';
import {PanelEditorProps} from "@grafana/data";
import {Tab, TabContent, TabsBar} from "@grafana/ui";
import {UseState} from "./use_state";
import CaricamentoJsonView from "./views/caricamento_json_view";
import CollegamentoView from "./views/collegamento_view";
import ListaCollegamentiView from "./views/lista_collegamenti_view";
import PrevisioneView from "./views/previsione_view";
import Controller from "../controller/controller";
import "./css/index.css"
import {SystemJS} from "@grafana/runtime"


const tabs = [
    {label: 'Upload JSON', key: 'first', active: true},
    {label: 'Connect predictors', key: 'second', active: false},
    {label: 'Connection list', key: 'third', active: false},
    {label: 'Prediction', key: 'fourth', active: false},
];

interface State {
    status: "loading" | "loaded"
}

class Editor extends PureComponent<PanelEditorProps, State> {
    private _controller: Controller | undefined;
    private _eventEmitter: any;

    constructor(props: Readonly<PanelEditorProps>) {
        super(props);
        this.state = {status: "loading"}
        setTimeout(() => {
            while (this.props.data.request === undefined)
                console.log("loading"); //aspetta che venga caricata la request
            this.setState({status: "loaded"})
        }, 0)
        SystemJS.load('app/core/app_events').then((appEvents: any) => {
            this._eventEmitter = appEvents
        })
    }

    render() {
        if (this.state.status === "loaded" && this.props.data.request != undefined) {

            if (this._controller === undefined)
                this._controller = Controller.requireController(this.props.data.request.panelId)

            return (
                <UseState initialState={tabs}>
                    { //children
                        (state, updateState) => { //state contiene le tabs definite sopra, updateState è una funzione che prende 1 parametro che è il nuovo stato
                            if (this._controller != undefined)
                                return (
                                    <>
                                        <TabsBar>
                                            {
                                                state.map((tab, index) => {
                                                    return ( //ritorna una tab per ogni tab contenuta in tabs
                                                        <Tab
                                                            key={index}
                                                            label={tab.label}
                                                            active={tab.active}
                                                            onChangeTab={() => updateState( //invodo il cambiamento dello stato, in questo caso gli passo il nuovo stato
                                                                state.map((tab, idx) => (   //le differenze saranno che lo active cambierà in base a quale tab è stata cliccata
                                                                    {...tab, active: idx === index}
                                                                ))
                                                            )}
                                                        />
                                                    );
                                                })
                                            }
                                        </TabsBar>
                                        <TabContent>
                                            {state[0].active && <CaricamentoJsonView emitter={this._eventEmitter}
                                                                                     controller={this._controller}/>}
                                            {state[1].active && <CollegamentoView controller={this._controller}
                                                                                  queries={this.props.data.series}
                                                                                  emitter={this._eventEmitter}/>}
                                            {state[2].active && <ListaCollegamentiView controller={this._controller}
                                                                                       queries={this.props.data.series}
                                                                                       emitter={this._eventEmitter}
                                            />}
                                            {state[3].active && <PrevisioneView controller={this._controller}
                                                                                emitter={this._eventEmitter}/>}
                                        </TabContent>
                                    </>
                                );
                            else
                                return <p>Something has gone wrong. Try refreshing the page.</p>
                        }
                    }
                </UseState>
            );
        } else //la request non è ancora caricata, quindi non è presente il controller
            return <p>Loading</p>
    }
}

export default Editor;