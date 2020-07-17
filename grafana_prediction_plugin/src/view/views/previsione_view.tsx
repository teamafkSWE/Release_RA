import React, {PureComponent} from 'react';
import {Button, HorizontalGroup, PanelOptionsGroup} from "@grafana/ui";
import Observer from "../observer/observer";
import {Datasource} from "../../types";
import Controller from "../../controller/controller";
import {AppEvents} from "@grafana/data";

interface Props {
    controller: Controller
    emitter: any
}

interface State {
    monitoring: boolean
    saving: boolean
    datasources: Datasource[]
    measurement: string
}

class PrevisioneView extends PureComponent<Props, State> implements Observer {
    private readonly selectRef: any;

    constructor(props: Readonly<Props>) {
        super(props);
        this.props.controller.attach(this)
        this.selectRef = React.createRef()
        const measurement = this.props.controller.getMeasurement()
        this.state = {
            monitoring: props.controller.isMonitoring(),
            saving: props.controller.isSaving(),
            datasources: [],
            measurement: measurement === undefined ? "" : measurement
        }
        props.controller.updateDatasources().then(datasources => {
                this.setState({datasources: datasources})
            }
        )
    }

    componentDidUpdate() {
        const datasource = this.props.controller.getDatasource()
        if (datasource === null)
            this.selectRef.current.options.selectedIndex = 0
        else {
            let i = 0
            while (datasource.id != this.state.datasources[i].id)
                i++
            this.selectRef.current.options.selectedIndex = i + 1;
        }
    }

    componentWillUnmount() {
        this.props.controller.detach(this)
    }

    update(): void {
        if (this.props.controller.isMonitoring())
            this.setState({monitoring: true})
        else
            this.setState({monitoring: false})

        if (this.props.controller.isSaving())
            this.setState({saving: true})
        else
            this.setState({saving: false})
    }

    private setDatasource = (event: any) => {
        const id = event.target.value
        this.props.controller.setDatasource(id)
        this.forceUpdate()
    }

    private setMeasurement = (event: any) => {
        const measurement = event.target.value
        this.setState({measurement: measurement})
        this.props.controller.setMeasurement(measurement)
    }

    private stopMonitoring = () => {
        if (this.props.controller.getConnections().length != 0) {
            this.props.controller.stopMonitoring()
            this.props.emitter.emit(AppEvents.alertSuccess, ["Monitoring stopped."])
        } else
            this.props.emitter.emit(AppEvents.alertWarning, ["No connection established."])
    }

    private startMonitoring = () => {
        if (this.props.controller.getConnections().length != 0) {
            this.props.controller.startMonitoring()
            this.props.emitter.emit(AppEvents.alertSuccess, ["Monitoring started."])
        } else
            this.props.emitter.emit(AppEvents.alertWarning, ["No connection established."])
    }

    private monitoringButton = () => {
        const {monitoring} = this.state
        if (monitoring) {
            return <Button variant={"secondary"} icon={"pause"} onClick={this.stopMonitoring}>Stop monitoring</Button>
        } else {
            return <Button variant={"primary"} icon={"play"} onClick={this.startMonitoring}>Start monitoring</Button>
        }
    }

    private enableSaving = () => {
        try {
            this.props.controller.startSaving()
            this.props.emitter.emit(AppEvents.alertSuccess, ["Saving started."])
        } catch (e) {
            this.props.emitter.emit(AppEvents.alertError, [e.name, e.message])
        }
    }

    private disableSaving = () => {
        try {
            this.props.controller.stopSaving()
            this.props.emitter.emit(AppEvents.alertSuccess, ["Saving stopped."])
        } catch (e) {
            this.props.emitter.emit(AppEvents.alertError, [e.name, e.message])
        }
    }

    private savingForm = () => {

        const saveButton = () => {
            const {saving, measurement} = this.state
            const datasource = this.props.controller.getDatasource()
            if (saving)
                return <Button variant={"secondary"} onClick={this.disableSaving}>Disable saving</Button>
            else if (measurement !== "" && datasource !== null)
                return <Button variant={"primary"} onClick={this.enableSaving}>Enable saving</Button>
            else
                return <Button disabled={true} variant={"primary"} onClick={this.enableSaving}>Enable saving</Button>
        }

        const getOptions = () => {
            const options = []
            if (this.state.datasources.length === 0)
                options.push(<option value={" "}>No datasource found.</option>)
            else
                for (let ds of this.state.datasources) {
                    options.push(<option value={ds.id}>{ds.name}</option>)
                }
            return options
        }

        return (
            <>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <label style={{alignSelf: "center"}} htmlFor={"dbs"}>Select the Data Source:</label>
                    <select ref={this.selectRef} id={"dbs"} onChange={this.setDatasource}>
                        <option value={" "}>Datasource...</option>
                        {getOptions()}
                    </select>
                </div>
                <div style={{margin: "0.8rem 0 1rem"}}>
                    <label htmlFor={"measurement"}>Enter a name for the measurement:</label>
                    <input style={{width: "100%"}} id={"measurement"} type={"text"} value={this.state.measurement} onChange={this.setMeasurement}/>
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    {saveButton()}
                </div>
            </>
        )
    }

    render() {
        return (
            <HorizontalGroup>
                <PanelOptionsGroup title="Monitoring">
                    {this.monitoringButton()}
                </PanelOptionsGroup>

                <PanelOptionsGroup title="Saving">
                    {this.savingForm()}
                </PanelOptionsGroup>
            </HorizontalGroup>
        );
    }
}

export default PrevisioneView;
