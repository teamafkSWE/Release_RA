import {Predictor, Connection, Datasource} from "../types";
import Observable from "./observable";
import Algorithm from "../model/algorithm";
import {Svm} from "../model/algorithms/svm";
import {Regression} from "../model/algorithms/regression";
import {DataFrame, FieldType,} from "@grafana/data";
import Axios from "axios";
import Influx from "../model/database/influx";

export default class Controller extends Observable {

    private static _controllers: Map<number, Controller> = new Map<number, Controller>()

    public static requireController = (id: number) => {
        let controller = Controller._controllers.get(id)
        if (controller === undefined) {
            controller = new Controller()
            Controller._controllers.set(id, controller);
        }
        return controller
    }

    public static unloadController = (id: number) => {
        Controller._controllers.delete(id)
    }


    private _json: any;
    private _file: File | undefined;
    private _predictors: Predictor[] = [];
    //private _b: number | undefined;
    private _algorithm: Algorithm | undefined;
    // private _threshold: Threshold | undefined
    //private _queries: DataFrame[] = []; //a che serve questo campo?
    private _connections: Connection[] = [];
    private _newConnectionIndex = 0; //attenzione, può solo incrementare, non credo vada bene
    private _isMonitoring: boolean = false;
    private _isSaving: boolean = false;
    private _predictedData: { name: string, data: number[][] }[] = [];
    private _datasources: Datasource[] = []
    private _datasourceID: string | undefined
    private _measurement: string | undefined
    private _influx: Influx | null = null;

    private constructor() {
        super();
    }

    private static _checkJson = (file:any) => {
        if (file.author === undefined || file.author !== "TeamAFK") return false
        else if (file.version === undefined) return false
        else if (file.algorithm === undefined || (file.algorithm !== "Linear Regression" && file.algorithm !== "SVM")) return false
        else if (file.date === undefined) return false
        else if (file.predictors === undefined) return false
        else if (file.result === undefined) return false

        return true
    }

    private _definePredictors = () => {
        this._predictors = [];
        const rawPredictors = this._json.predictors
        const rawValues = this._json.result
        const predictorsNames: string[] = []
        const predictorsValues: number[] = []
        if (this._json.algorithm === "Linear Regression") {
            rawPredictors.a.forEach((name: string) => predictorsNames.push(name))
            rawValues.a.forEach((value: number) => predictorsValues.push(value))
        } else if (this._json.algorithm === "SVM") {
            rawPredictors.w.forEach((name: string) => predictorsNames.push(name))
            rawValues.w.forEach((value: number) => predictorsValues.push(value))
        }

        for (let i = 0; i < predictorsNames.length; i++) {
            this._predictors.push(new Predictor(predictorsNames[i], predictorsValues[i]))
        }
    }

    private _setStrategy = () => {
        const algorithm: string = this._json.algorithm
        if (algorithm === 'Linear Regression') {
            this._algorithm = new Regression(this._json.result.a, this._json.result.b);
        } else if (algorithm === 'SVM') {
            this._algorithm = new Svm(this._json.result.w, this._json.result.b);
        }
    }

    public setJson = (file: any) => {
        const fr = new FileReader()
        fr.onload = (event) => {
            if (event.target !== null && typeof event.target.result === "string") {
                const jsonParsed = JSON.parse(event.target.result);
                if (Controller._checkJson(jsonParsed)) {
                    this._json = jsonParsed
                    this._file = file
                    this._definePredictors()
                    this._setStrategy()
                }
                this.notifyAll()
            }
        }
        fr.readAsText(file)
        return this
    }

    public addConnection = (connection: { name: string, links: { predictor: string, query: string }[] }) => {
        this._connections.push(new Connection(this._newConnectionIndex.toString(), connection.name, connection.links));
        this._newConnectionIndex++;
        this.notifyAll();
    }
    public editConnection = (id: string, obj: { name: string, list: { predictor: string, query: string }[] }) => {

        for (let i = 0; i < this._connections.length; i++) {
            if (this._connections[i].id === id) {
                this._connections[i].name = obj.name;
                this._connections[i].links = obj.list;
            }
        }
    }
    public removeConnection = (id: string) => {
        for (let i = 0; i < this._connections.length; i++) {
            if (this._connections[i].id === id) {
                this._connections.splice(i, 1);
            }
        }
        this.notifyAll();
    }

    // public setThresholds = (sMin: number, sMax: number): boolean => {
    //     if (sMin !== null && sMin.toString().length === 1)
    //         sMin = parseInt("0" + sMin)
    //     if (sMax !== null && sMax.toString().length === 1)
    //         sMax = parseInt("0" + sMax)
    //     if (sMin >= sMax || (sMin === 0 && sMax === 0)) {
    //         alert("SogliaMin non valida. Inserire un valore minore della sogliaMax.")
    //         return false
    //     } else {
    //         if (this._threshold === undefined) {
    //             this._threshold = new Threshold(sMin, sMax)
    //         } else {
    //             this._threshold.min = sMin
    //             this._threshold.max = sMax
    //         }
    //         alert("Soglie inserite correttamente.")
    //     }
    //     return true
    // }

    public setDatasource = (id: string) => {
        this._datasourceID = id
    }

    public setMeasurement = (measurement: string) => {
        this._measurement = measurement
    }

    /*public handleInserimentoCollegamento = (bool: any) => {
        if(bool === true)
            return true
        else
            return false
    }*/
    /*
    public handleConfermaCollegamento = (bool: any) => {
        if (this.handleSoglie() && bool === true){
            alert("Collegamento confermato.")
            return true
        }else {
            if(!this.handleSoglie() && bool === true)
                alert("Soglie non impostate correttamente.")
            else if (this.handleSoglie() && bool === false)
                alert("Collegamento non inserito correttamente.")
            else
                alert("Inserire un collegamento ed impostare le relative soglie.")
            return false
        }
    }*/

    /*
    public setQueries = (queries: DataFrame[]) => {
        this._queries = queries;
    }
    */

    public updateDatasources = async () => {
        this._datasources = []
        const response = await Axios.get(window.location.origin + "/api/datasources")
        return new Promise<Datasource[]>((resolve) => {
            if (response.status === 200) {
                const datasources = response.data
                for (let ds of datasources) {
                    if (ds.type === "influxdb")
                        this._datasources.push(new Datasource(ds.id, ds.database, ds.name, ds.url, ds.user, ds.password))
                }
            }
            resolve(this._datasources)
        })
    }

    public updatePredictions = (series: DataFrame[]) => {
        //console.log('updating predictions')
        for (let connection of this._connections) { //calcolo la previsione per ogni collegamento
            //console.log('connection name', connection.name)
            //console.log('connection', connection)
            const inputs: number[] = [] //array usato per calcolare la predizione
            for (let query of series) {
                //console.log('query', query)
                const queries: string[] = [] //array che contiene tutti i nomi delle query per questo collegamento
                connection.links.forEach(ele => queries.push(ele.query))
                //console.log('queries selected', queries)
                if (queries.includes(query.name as string)) {// questa query serve al calcolo della previsione
                    if (query.fields[0].type === FieldType.number) {
                        //console.log('found a number query')
                        let i = query.fields[0].values.length - 1
                        while (query.fields[0].values.get(i) == null && i > 0) {
                            i--
                        }
                        //console.log(query,i)
                        inputs.push(query.fields[0].values.get(i)) //inserisco il primo valore non nullo
                        //console.log(inputs);
                        //console.log(inputs[inputs.length-1])
                    }
                }
            }
            //console.log('input length', inputs.length)
            if (inputs.length === 0)
                return; //se non sono stati inseriti input allora non sono state impostate correttamente i predittori

            const predicted = this.getPrediction(inputs)
            //console.log('predicted value', predicted)
            if (predicted === null) // se non è stato possibilie calcolare la previzione allora non ha senso continuare
                return;

            if (this._isSaving && this._influx != null) {
                try {
                    this._influx.write(predicted)
                } catch (e) {
                    console.error(e)
                }
            }

            let time: number = 0 //timestamp da associare alla predizione
            for (let ele of series[0].fields) {
                if (ele.type === FieldType.time) {
                    //appena trovo una serie che contiene gli orari mi fermo (si potrebbe farlo continuare ma secondo me non è sicuro)
                    time = ele.values.get(ele.values.length - 1) //inserisco l'ultimo orario (che dovrebbe essere quello della previsione)
                    //console.log('time found', time)
                    break
                }
            }
            let data = [time, predicted]
            //console.log('data to be written in panel', data)
            let inserted = false
            for (let serie of this._predictedData) {
                if (serie.name === connection.name) {
                    serie.data.push(data)
                    //console.log('data pushed to an already existing connection')
                    inserted = true
                }
            }
            if (!inserted)
                this._predictedData.push({name: connection.name, data: [data]})
            //console.log('created a new serie of data')
        }
        //console.log('update finished')
    }


    /*  non credo sia una funzione utile

        public setController = (queries: DataFrame[], valueSogliaMin: number, valueSogliaMax: number,) =>{
            this.setQueries(queries);
            this.setSogliaMax(valueSogliaMin);
            this.setSogliaMin(valueSogliaMax);
        }
    */

    //potrebbe essere un metodo privato, ma forse è meglio lasciarlo pubblico
    public getPrediction = (inputs: number[]) => {
        if (this._algorithm !== undefined)
            return this._algorithm.predict(inputs);
        return null
    }

    public getPredictedData = (connectionName: string): number[][] => {
        let data: number[][] = [];
        this._predictedData.forEach(ele => {
            if (ele.name === connectionName) {
                data = ele.data;
                return
            }
        })
        return data;
    }

    public getDatasource = () => {
        if (this._datasourceID != undefined) {
            for (let ds of this._datasources) {
                if (ds.id === this._datasourceID) {
                    return ds
                }
            }
        }
        return null
    }

    public getMeasurement = () => {
        return this._measurement
    }

    public getConnections = () => {
        return this._connections;
    }

    public getFile = () => {
        return this._file
    }

    public getJson = () => {
        return this._json
    }

    public getPredictors = () => {
        return this._predictors
    }

    // public getThresholds = () => {
    //     return this._threshold;
    // }

    /*
    public getQueries = () => {
        return this._queries;
    }

    public getB = () => {
        return this._b
    }
    */

    public isMonitoring = () => {
        return this._isMonitoring
    }

    public startMonitoring = () => {
        this._isMonitoring = true
        this.notifyAll()
    }

    public stopMonitoring = () => {
        this._isMonitoring = false
        this.notifyAll()
    }

    public isSaving = () => {
        return this._isSaving
    }

    public startSaving = () => {
        const datasource = this.getDatasource()
        if (datasource != null) {
            const url = datasource.url
            Influx.connect(url.hostname, url.port, datasource.database, datasource.user, datasource.password)
                .then(ifx => {
                    if (ifx === null) {
                        throw new Error('Unable to connect to database.')
                    } else {
                        if (this._measurement != undefined) {
                            this._influx = ifx
                            this._isSaving = true
                            this._influx.measurement = this._measurement
                            this.notifyAll()
                        } else {
                            throw new Error('The measurement is undefined.')
                        }
                    }
                })
        }
    }

    public stopSaving = () => {
        this._isSaving = false
        this.notifyAll()
    }
}

