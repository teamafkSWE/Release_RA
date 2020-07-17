import React, {Component} from 'react';
import "bootstrap/dist/css/bootstrap.css"
import './app.css';
import Header from "./uiComponents/header";
import InsertCsvButton from "./uiComponents/insert_csv_button";
import ComboBoxAlgorithm from "./uiComponents/combo_box_algorithm";
import ComboBoxAxisX from "./uiComponents/combo_box_x_axis";
import ViewModel from "../viewModel/viewModel";
import TrainButton from "./uiComponents/train_button";
import DownloadJson from "./uiComponents/download_Json";
import Chart from "./uiComponents/chart";
import TextAreaNotes from "./uiComponents/textArea";
import TextAreaFileName from "./uiComponents/textAreaFileName";
import Information from "./uiComponents/information";
import Footer from "./uiComponents/footer";
class App extends Component{
  #viewModel=null;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            hide:false,
            fileName: null,
            changeName: "",
            hasFile: false,
            trainSuccessfully: false,
            algorithm: "",
            notes: "",
            jsonData:null,
            xAxis:""
        }
         this.#viewModel= new ViewModel();
    }
    setShowTrue=()=>{
        this.setState({hide:true});
    }
    setShowFalse=()=>{
        this.setState({hide:false});
    }
    showInfo=()=>{
        return this.state.hide===true? <Information setShowFalse={this.setShowFalse}/> : null;
    }

    setDefaultName = () => {
        if(this.state.algorithm === "svm")
            return "predictorSVM";
        else
            return "predictorRL";
    }

    changeAlgorithm =(event)=> {
        this.setState({algorithm: event.target.value});
    }
    changeXAxis =(event)=> {
        this.#viewModel.setXAxis(event.target.value);
        this.setState({xAxis: event.target.value});
    }
    resetAlgorithm =(algorithm)=> {
        this.setState({algorithm:algorithm});
    }

    setDataFromFile =(data, fileInfo)=> {
        this.#viewModel.setFileData(data,true);
        this.#viewModel.setNotes("");
        this.setState({data:data, fileName: fileInfo.name, hasFile:true, algorithm:'', trainSuccessfully:false, notes:'', changeName:'', jsonData:null, xAxis:data[0][0]});
    };

    handleTraining =()=> {
        this.#viewModel.setAlgorithm(this.state.algorithm)
        let success=this.#viewModel.performTraining();
        if(success===false){
            this.resetAlgorithm("");
            this.setState({jsonData:null,trainSuccessfully:false});

        }
        else {
            this.setState({trainSuccessfully: true});
        }
    }
    selectAxisX=()=> {
        if(this.state.hasFile!==false)
            return <ComboBoxAxisX viewModel={this.#viewModel} changeXAxis={this.changeXAxis} xAxis={this.state.xAxis}/>
    }
    downloadJsonData =()=> {
        if(this.state.trainSuccessfully === true) {
            return (
                <DownloadJson jsonData={this.#viewModel.getJsonContent()} viewModel={this.#viewModel} changeName={this.state.changeName} defaultName={this.setDefaultName}/>
            )
        }
    }
    handleNotes = (event) => {
        this.#viewModel.setNotes(event.target.value)
        this.setState({notes: event.target.value})
    }

    handleName = (event) => {
        this.setState({changeName: event.target.value})
    }

    render(){
        return(
        <div className="mt-4 mb-4 text-center" >
            <Header setShowTrue={this.setShowTrue}/>

            <div className={"w-100 p-3 row text-center"}>
                <div className={"col 3"}>
                    <InsertCsvButton handleForce={this.setDataFromFile}/>
                    <p>{this.state.fileName}</p>
                </div>
                <div className={"col 4"}>
                    <ComboBoxAlgorithm changeAlgorithm={this.changeAlgorithm} algorithm={this.state.algorithm}/>
                </div>
                <div className={"col 5"}>
                    <TrainButton train={this.handleTraining}/>
                </div>
                <div  className={"col 6"}>
                    {this.downloadJsonData()}
                </div>
            </div>
            <div id={"selectXaxis"}>
                {this.selectAxisX()}
            </div>
            <div id={"chartNote"} >
                <div className="row">
                            <div  id={"chart"}  className="col-9">
                                <Chart json={this.state.trainSuccessfully} viewModel={this.#viewModel} hasFile={this.state.hasFile}/>
                            </div>

                            <div  className="col-3">
                                <TextAreaFileName handleName={this.handleName} changeName={this.state.changeName}/>
                                <p/>
                                <TextAreaNotes handleNotes={this.handleNotes} notes={this.state.notes}/>
                            </div>
                </div>
            </div>
            {this.showInfo()}
            <div id={"footer"}>
                <Footer/>
            </div>
        </div>
    );
  }
}
export default App;