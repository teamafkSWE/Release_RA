import React, {PureComponent} from "react";
import {ArrayVector, FieldColorMode, FieldType, GraphSeriesXY, PanelProps} from "@grafana/data";
import Controller from "../controller/controller";
import {Graph} from "@grafana/ui";

export default class Panel extends PureComponent<PanelProps> {
    private _controller: Controller = Controller.requireController(this.props.id);
    private _series: GraphSeriesXY[] = [];

    state = {
        line: false
    }

    componentWillUnmount() {
        Controller.unloadController(this.props.id)
    }

    private _randomColor = () => {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    //inserisco dentro _series una linea per ogni collegamento impostato
    private _setupGraphSeries = () => {
        const connections = this._controller.getConnections() //tutte le connesioni che devo mostrare
        for (let connection of connections) {
            let updated = false
            for (let serie of this._series) { //cerco una serie con il nome della connessione
                //console.log(connection.name, serie.label)
                if (serie.label === connection.name) { //nelle series c'è già una serie con questo nome, aggiorno i suoi valori
                    serie.data = this._controller.getPredictedData(serie.label)
                    updated = true
                    break
                }
            }
            if (!updated) { //se non ho aggiornato i valori vuol dire che non ho trovato una serie con quel nome, procedo ad aggiungerla
                this._series.push({ // linea
                    //array 2d, primo valore è il timestamp, il secondo è il valore da mostrare
                    data: this._controller.getPredictedData(connection.name), //aggiorno i punti del grafico
                    color: this._randomColor(), //colore della linea
                    isVisible: true, //visibilità della linea (non credo abbia senso metterlo false)
                    label: connection.name, //nome della linea, che equivale al nome del collegamento
                    seriesIndex: this._series.length, //indice della linea (forse per indicare quale linea deve stare davanti e quale dietro)
                    timeField: {//non ho idea di cosa serva
                        type: FieldType.time,
                        name: 'time',
                        values: new ArrayVector(), //forse serve per visualizzare il valore quando si clicca sul grafico
                        config: {},
                    },
                    valueField: {//non ho idea di cosa serva
                        type: FieldType.number,
                        name: 'a-series',
                        values: new ArrayVector(),
                        config: {
                            color: {
                                mode: FieldColorMode.Fixed,
                                fixedColor: 'red',
                            },
                        },
                    },
                    timeStep: 3600000, //vuoto totale
                    yAxis: {
                        index: 0, //la cipolla
                    },
                })
            }
        }
    }

    private _viewGraph = () => {
        const json = this._controller.getJson()
        if (json != undefined) {
            this.state.line = json.algorithm === 'Linear Regression';
        }
        if (this._controller.isMonitoring()) {
            //console.log('panel updating')
            this._controller.updatePredictions(this.props.data.series)
            this._setupGraphSeries()
            //console.log(this._series)
        }
    }


    render() {
        {
            this._viewGraph()
        }
        return (<Graph height={this.props.height}
                       width={this.props.width /*prende la larghezza del monitor*/}
                       series={this._series}
                       timeRange={this.props.data.timeRange /*prende il range orario(last x hours/mins) impostato sulla dashoard*/}
                       timeZone="browser"
                       showLines={this.state.line}
                       showPoints={!this.state.line}/>);
    }
}